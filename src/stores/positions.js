import { makeRequest } from "@/requests/requests";
import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const usePositionStore = defineStore("positions", () => {
  const endpoint = "positions";
  const positions = ref([]);
  const idToSqoff = ref(null);

  //   Get positions
  const getPositions = async () => {
    try {
      const response = await makeRequest(endpoint, "GET" , {}, {}, {} , 2 , null);
      if (response.data) {
        positions.value = response.data.positions;
      }
    } catch (error) {
      console.log("This is error", error);
    }
  };

  const sqoffPosition = async () => {
    try {
      
      if (idToSqoff.value) {
        const response = await makeRequest('squareOff', "PUT", {}, {}, {} , 0 , idToSqoff.value);
        if (response.data) {
          await getPositions();
          idToSqoff.value = null; // Reset idToSqoff after successful sqoff
        }
      }
    } catch (error) {
      console.log("This is error", error);
    }
  }


  //   Group the positoin according the strategy and users
  const groupedPositions = computed(() => {
    const grouped = {};

    positions.value.forEach((pos) => {
      const userKey = `${pos.user_id}_${pos.user_email}`; // Treat same email + id as one user
      const strategyKey = `${pos.strategy_id}_${pos.strategy_name}`;

      if (!grouped[userKey]) {
        grouped[userKey] = {
          user_id: pos.user_id,
          user_email: pos.user_email,
          user_name: pos.user_name,
          strategies: {},
        };
      }

      const userGroup = grouped[userKey];

      if (!userGroup.strategies[strategyKey]) {
        userGroup.strategies[strategyKey] = {
          strategy_id: pos.strategy_id,
          strategy_name: pos.strategy_name,
          strategy_script: pos.strategy_script,
          strategy_type: pos.strategy_type,
          total_quantity: 0,
          total_buy_price: 0,
          total_sell_price: 0,
          avg_buy_price: 0,
          avg_sell_price: 0,
          positions: [],
        };
      }

      const strat = userGroup.strategies[strategyKey];
      strat.positions.push(pos);
      strat.total_quantity += pos.quantity;
      strat.total_buy_price += pos.buy_price * pos.buy_quantity;
      strat.total_sell_price += pos.sell_price * pos.sell_quantity;
    });

    // Calculate average prices
    for (const userKey in grouped) {
      const user = grouped[userKey];
      for (const strategyKey in user.strategies) {
        const strat = user.strategies[strategyKey];
        strat.avg_buy_price = strat.total_quantity
          ? strat.total_buy_price / strat.total_quantity
          : 0;
        strat.avg_sell_price = strat.total_quantity
          ? strat.total_sell_price / strat.total_quantity
          : 0;
      }
    }

    return grouped;
  });

  //   Calculate the ratio 
  const flatStrategySummary = computed(() => {
    const result = [];

    for (const userKey in groupedPositions.value) {
      const userGroup = groupedPositions.value[userKey];

      for (const stratKey in userGroup.strategies) {
        const strat = userGroup.strategies[stratKey];

        const totalProfit = strat.total_sell_price - strat.total_buy_price;
        const adminRatio = strat.positions[0]?.admin_share_ratio ?? 0;
        const userRatio = 100 - adminRatio;

        result.push({
          id: `${userGroup.user_id}-${strat.strategy_id}`,
          created_at: strat.positions[0]?.created_at,
          name: userGroup.user_name,
          strategy: strat.strategy_name,
          totalProfit: totalProfit.toFixed(2),
          admin_share_ratio: adminRatio,
          userShare: ((totalProfit * userRatio) / 100).toFixed(2),
          adminShare: ((totalProfit * adminRatio) / 100).toFixed(2),
        });
      }
    }

    return result;
  });


  //   Calculate total user profit after admin cut
  const userTotalProfits = computed(() => {
    const result = {};

    for (const userKey in groupedPositions.value) {
      const userGroup = groupedPositions.value[userKey];
      let totalUserProfit = 0;

      for (const stratKey in userGroup.strategies) {
        const strat = userGroup.strategies[stratKey];
        const totalProfit = strat.total_sell_price - strat.total_buy_price;
        const adminRatio = strat.positions[0]?.admin_share_ratio ?? 0;
        const userRatio = 100 - adminRatio;

        totalUserProfit += (totalProfit * userRatio) / 100;
      }

      result[userKey] = {
        user_id: userGroup.user_id,
        user_email: userGroup.user_email,
        user_name: userGroup.user_name,
        totalUserProfit: totalUserProfit.toFixed(2),
      };
    }

    return result;
  });

  // Group all strategies' positions together per user
  const groupedUserPositions = computed(() => {
    const result = {};

    for (const userKey in groupedPositions.value) {
      const userGroup = groupedPositions.value[userKey];

      if (!result[userGroup.user_id]) {
        result[userGroup.user_id] = {
          user_id: userGroup.user_id,
          user_email: userGroup.user_email,
          user_name: userGroup.user_name,
          positions: [], // all positions will go here
          total_quantity: 0,
          total_buy_price: 0,
          total_sell_price: 0,
        };
      }

      const user = result[userGroup.user_id];

      for (const stratKey in userGroup.strategies) {
        const strat = userGroup.strategies[stratKey];

        // Add all positions
        user.positions.push(...strat.positions);

        // Sum totals
        user.total_quantity += strat.total_quantity;
        user.total_buy_price += strat.total_buy_price;
        user.total_sell_price += strat.total_sell_price;
      }
    }

    // Optionally calculate total profit for each user
    for (const userId in result) {
      const user = result[userId];
      user.total_profit = user.total_sell_price - user.total_buy_price;
    }

    return result;
  });



  //grouped strategy positions for dashboard
  const groupedStrategies = computed(() => {
    const map = new Map()

    positions.value.forEach(pos => {
      const key = pos.strategy_id
      if (!map.has(key)) {
        map.set(key, {
          strategy_id: pos.strategy_id,
          strategy_name: pos.strategy_name,
          side: pos.side,
          status: 'CLOSED',
          buy_price: 0,
          sell_price: 0,
          positions: []
        })
      }

      const group = map.get(key)
      group.positions.push(pos)

      group.buy_price = parseFloat(pos.buy_price) || 0
      group.sell_price = parseFloat(pos.sell_price) || 0

      if (pos.status === 'OPEN') {
        group.status = 'OPEN'
      }
    })

    return Array.from(map.values())
  })

  getPositions();

  return {
    getPositions,
    sqoffPosition,
    positions,
    idToSqoff,
    groupedStrategies,
    groupedPositions,
    flatStrategySummary,
    userTotalProfits,
    groupedUserPositions
  };
});
