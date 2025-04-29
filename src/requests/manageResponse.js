import { ref } from 'vue';
import Toastify from "toastify-js";
import dom from "@left4code/tw-starter/dist/js/dom";
import { canMakeRequest } from '@/requests/requests';
import { useUserStore } from '@/stores/users';
import { useMasterOrderStore } from '@/stores/masterOrders';
import { useStrategiesStore } from '@/stores/strategies';
import { useJoinerStore } from '@/stores/joiners';
import { usePositionStore } from '@/stores/positions';
import { useAlertsStore } from '@/stores/alerts';
import { useBrokerStore } from '@/stores/brokers';
import { useToastStore } from '@/stores/toast';
import { useOrderStore } from '@/stores/orders';

let messageType = ref('');

const messageName = {
    users: 'user',
    webhookStrategyJoiner: 'webhook_strategy_joiner',
    matrixStrategyJoiner: 'matrix_strategy_joiner',
    webhookOrders: 'webhook_orders',
    matrixOrders: 'matrix_orders',
    matrixErrors: 'matrix_errors',
    webhookErrors: 'webhook_errors',
    brokers: 'broker',
    generateToken: 'token',
    strategies: 'strategy',
    webhookStrategies: 'webhook strategy',
    webhookPaperPositions: 'webhook_paper_position',
    strategyPaperPosition: 'webhook_stg_paper_position',
    paperPosition: 'paper_position',
    matrixPaperPosition: 'matrix_stg_paper_position',
    matrixPaperOrder: 'matrix_paper_order',
    matrixDemoPaperPosition: 'matrix_demo_stg_paper_position',
    myStrategies: 'Webhook_strategy',
    strategyType: 'strategy',
    // orders: 'order',
    // mystrategies: 'strategy',
    positions: 'position',
    invoices: 'invoice',
    invoiceItems: 'invoice_item',
    generalOffers: 'generalOffer',
    specialOffers: 'specialOffer',
    // webhook_strategies: 'webhook strategy',
    admin: 'admin',
    salesUser: 'salesUser',
    plans: 'plans',
    productCategories: 'productCategory',
    matrixPlanStrategy: 'matrix_plan_strategy',
    roles: 'roles',
    manageOrders: 'manage_order',
    manageStages: 'manage_stage',
    matrixAlerts: 'matrix_alert',
    webhookAlerts: 'webhook_alert',
    webhookPositions: 'webhook_position',
    videos: 'videos',
    socials: 'social',
    paymentQr: 'PaymentQR',
    userAddresses: 'user_address',
    promoCode: 'promo_code',

    groups: 'group',
    groupJoiners: 'group_joiner',
    groupAlerts: 'group_alert',
    groupMaster: 'group_master',
    groupOrders: 'group_order',
    manualPositions: 'manual_position',


    signalJoiner: 'signal_joiner',
    signalOrders: 'signal_order',
    signalPositions: 'signal_position',
    signal: 'signal',

    indicators: 'indicator',

    subscriptions: 'subscriptions',
    screeners: 'screeners',
    matrixSummary: 'matrix_summary',
}

const statusMessages = {
    200: 'Success: ',
    201: 'Created: ',
    400: 'Bad Request: ',
    401: 'Unauthorized: ',
    403: 'Forbidden: ',
    404: 'Not Found: ',
    500: 'Internal Server Error: ',
    502: 'Bad Gateway: ',
    503: 'Service Unavailable: ',
    504: 'Gateway Timeout: ',
};

const getMethods = ref({
    users: 'getUsers',
    manualOrders: 'getOrders',
    masterOrders: 'getMasterOrders',
    strategies: 'getStrategies',
    joiners: 'getJoiners',
    positions: 'getPositions',
    alerts: 'getAlerts',
    brokers: 'getBrokers',
    squareOff: 'getPositions',

})

function showToast(toastTitle, message, toastType, duration = 3000) {
    const toastStore = useToastStore();
    toastStore.addToast(toastTitle , message, toastType, duration);
}

const storeFunctions = {
    users: useUserStore,
    manualOrders: useOrderStore,
    masterOrders: useMasterOrderStore,
    strategies: useStrategiesStore,
    joiners: useJoinerStore,
    positions: usePositionStore,
    alerts: useAlertsStore,
    brokers: useBrokerStore,
    squareOff : usePositionStore

};

function ManageApiResponse(response, endpoint, method) {
    if (endpoint === 'positionCSVData') {
        addToast("Notice", "No data to download", "info");
        return;
    }

    try {
        if (endpoint !== 'profile') {
            const status = response?.status;
            const responseMessage = response?.data?.message || 'No message provided';
            const statusMessage = statusMessages[status] || 'Response';
            const fullMessage = `${responseMessage}`;

            // Determine toast type and title
            let toastType = "info";
            let toastTitle = statusMessage;

            if (status >= 200 && status < 300) {
                toastType = "success";
                toastTitle = "Success";
            } else if (status === 401) {
                toastType = canMakeRequest.value === false ? "error" : "warn";
                toastTitle = "Unauthorized";
            } else if (status >= 400 && status < 500) {
                toastType = "error";
                toastTitle = "Client Error";
            } else if (status >= 500) {
                toastType = "error";
                toastTitle = "Server Error";
            }

            // Show the toast
            showToast(toastTitle, fullMessage, toastType, 3000);

            // Endpoint remapping if needed
            if (endpoint === 'generateToken') endpoint = 'brokers';
            if (endpoint === 'strtgposSqOff') endpoint = 'strategies';

            // Call the store function if available
            if (toastType === "success") {
                const storeFunction = storeFunctions[endpoint];
                if (typeof storeFunction === 'function') {
                    storeFunction()[getMethods.value[endpoint]]();
                } else {
                    console.error('Store function not found for endpoint:', endpoint);
                }
            }
        } else {
            // Special case for profile
            const msg = response?.data?.message || 'No message';
            showToast("Info", msg, "info", 3000);
        }

    } catch (error) {
        console.error('Error in ManageApiResponse:', error);
        showToast("Error", "Unexpected error occurred", "error", 3000);
    }
}


function ManageWebsocketResponse(response) {

    if (response.type) {
        try {
            const excludedTypes = ["brokers", "webhookStrategies", "webhookStrategyJoiners", "updateUser", "mystrategies", "invoice", "strategies", "social", "videos"];

            if (!excludedTypes.includes(response.type)) {
                let formattedTime = ''
                if (response.method === 'POST') {
                    formattedTime = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' }).format(new Date(response.data.data.created_at));
                } else if (response.method === 'PUT') {
                    formattedTime = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' }).format(new Date(response.data.data.updated_at));
                }
                let side = ''
                if (response.type === 'orders' || response.type === 'webhookOrders') {
                    side = response.data.data.transaction_type
                    try {
                        playAudio('order');
                    } catch {
                        console.error('Error playing audio:', error);
                    }
                } else if (response.type === 'positions' || response.type === 'webhookPositions') {
                    side = response.data.data.side
                    try {
                        playAudio('order');
                    } catch {
                        console.error('Error playing audio:', error);
                    }
                }

                let strategyId = ''
                if (response.type === 'webhookOrders' || response.type === 'webhookPositions') {
                    strategyId = response.data.data.webhook_strategy_id
                } else {
                    strategyId = response.data.data.strategy_id
                }

                // const notificationsStore = storeFunctions.notifications();
                // notificationsStore.notificationsData.push({
                //     id: response.data.id,
                //     strategy_id: strategyId,
                //     status: response.data.data.status,
                //     heading: response.type,
                //     exchange: response.data.data.exchange,
                //     tradingsymbol: response.data.data.tradingsymbol,
                //     side: side,
                //     time: formattedTime,
                //     message: response.data.description
                // });


                let message = 'Success: ' + response.data.description;
                showToast(message, true);
            }

            const storeFunction = storeFunctions[response.type];
            if (typeof storeFunction === 'function') {
                if (response.type === 'positions') {
                    const storeFunctiontemp = storeFunctions['mystrategies'];
                    storeFunctiontemp()[getMethods.value['mystrategies']]();
                } else if (response.type === 'orders') {
                    const storeFunctiontempPapPo = storeFunctions['positionsPaper'];
                    storeFunctiontempPapPo()[getMethods.value['positionsPaper']]();
                } else if (response.type === 'webhookPositions') {
                    const storeFunctiontemp = storeFunctions['webhookStrategies'];
                    storeFunctiontemp()[getMethods.value['webhookStrategies']]();
                } else if (response.type === 'webhookOrders') {
                    const storeFunctiontemp = storeFunctions['webhookAlerts'];
                    storeFunctiontemp()[getMethods.value['webhookAlerts']]();

                    const storeFunctiontempWb = storeFunctions['webhookStrategies'];
                    storeFunctiontempWb()[getMethods.value['webhookStrategies']]();
                }

                if (response.type === 'orders' || response.type === 'positions' || response.type === 'users' || response.type === 'myStrategies') {
                    const storeFunctionSummary = storeFunctions['matrixSummary'];
                    storeFunctionSummary()[getMethods.value['matrixSummary']]();
                }

                storeFunction()[getMethods.value[response.type]]();
            } else {
                console.error('Store function not found for response.type:', response.type);
            }

        } catch (error) {
            console.error('Error in websocket manage:', error);
            throw error;
        }
    }
}



export { ManageApiResponse, ManageWebsocketResponse };