let libPrefix = 'Teleservice';

// Store the user status response from the Telegram API
function storeUserStatus() {
    let data = JSON.parse(content);
    
    if (!data.ok) {
        Bot.sendMessage('Error: Failed to get valid response from Telegram API');
        return;
    }
    
    let status = data.result.status;
    let prms = params.split(' ');
    let chatId = prms[0];
    let userId = prms[1];
    let chatStatuses = Bot.getProperty(`${libPrefix}_chatStatuses_${userId}`, {});

    chatStatuses[chatId] = status;
    Bot.setProperty(`${libPrefix}_chatStatuses_${userId}`, chatStatuses, 'json');
    
    let onSuccess = prms[2];
    let chatIds = prms.slice(3);
    let allChecked = true;

    for (let i = 0; i < chatIds.length; i++) {
        if (!chatStatuses[chatIds[i]]) {
            allChecked = false;
            break;
        }
    }
    
    if (allChecked) {
        let joinedChats = [];
        let notJoinedChats = [];
        
        for (let id in chatStatuses) {
            if (chatStatuses[id] === 'member' || chatStatuses[id] === 'administrator' || chatStatuses[id] === 'creator') {
                joinedChats.push(id);
            } else {
                notJoinedChats.push(id);
            }
        }
        
        let result = {
            userId: userId,
            joinedChats: joinedChats,
            notJoinedChats: notJoinedChats,
            isJoinedAll: notJoinedChats.length === 0
        };
        
        Bot.run({
            command: onSuccess,
            options: {
                result: result
            }
        });
    }
}

// Check if there are errors in the parameters
function isHaveError(botToken, userId, chatIds, onSuccess) {
    let example_code = `Libs.Teleservice.checkMembership("BOT_TOKEN", "USER_ID", ["CHAT_ID_1", "CHAT_ID_2"], "onCheckMembership")`;
    let err_msg;
    
    if (typeof(botToken) != 'string' || typeof(userId) != 'string' || !Array.isArray(chatIds)) {
        err_msg = 'Invalid parameters! Example: ' + example_code;
    } else if (typeof(onSuccess) != 'string') {
        err_msg = 'Need handler command! Example: ' + example_code;
    }
    
    if (err_msg) {
        Bot.sendMessage(err_msg);
        return true;
    }
    
    return false;
}

// Get the API URL for the Telegram getChatMember method
function getApiUrl(botToken, userId, chatId) {
    return `https://api.telegram.org/bot${botToken}/getChatMember?chat_id=${chatId}&user_id=${userId}`;
}

// Publish the library functions
publish({
    // Function to check membership status
    checkMembership: function(botToken, userId, chatIds, onSuccess) {
        if (isHaveError(botToken, userId, chatIds, onSuccess)) { return; }
        
        Bot.setProperty(`${libPrefix}_chatStatuses_${userId}`, {}, 'json');
        
        chatIds.forEach(chatId => {
            let url = getApiUrl(botToken, userId, chatId);
            HTTP.get({ url: url, success: `${libPrefix}_lib_on_http_success ${chatId} ${userId} ${onSuccess} ${chatIds.join(' ')}` });
        });
    }
});

// Handle the HTTP success response
on(`${libPrefix}_lib_on_http_success`, storeUserStatus);
