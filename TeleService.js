// Declare variables for the library prefix and the API URL
let libPrefix = "teleserviceLib";
let API_URL = "https://teleserviceapi.000webhostapp.com/api/broadcast/";

// Function to set up the admin panel
function setupAdminPanel() {
  const panel = {
    title: "Teleservice API Settings",
    description: "Configure your Teleservice API settings here.",
    icon: "settings",
    fields: [
      {
        name: "access_token",
        title: "Access Token",
        type: "string",
        placeholder: "Enter your access token",
        icon: "key"
      },
      {
        name: "bot_token",
        title: "Bot Token",
        type: "string",
        placeholder: "Enter your bot token",
        icon: "key"
      },
      {
        name: "admin",
        title: "Admin User ID",
        type: "string",
        placeholder: "Enter admin user ID",
        icon: "person"
      },
      {
        name: "parseMode",
        title: "Parse Mode",
        type: "string",
        placeholder: "Enter parse mode (e.g., HTML or Markdown)",
        icon: "document"
      },
      {
        name: "disableWebPreview",
        title: "Disable Web Preview",
        type: "checkbox",
        icon: "eye-off"
      },
      {
        name: "protectContent",
        title: "Protect Content",
        type: "checkbox",
        icon: "shield"
      },
      {
        name: "ispin",
        title: "Pin Message",
        type: "checkbox",
        icon: "pin"
      }
    ]
  };

  AdminPanel.setPanel({
    panel_name: "TeleserviceAPI",
    data: panel
  });
}

// Function to get the admin panel variables
function getAdminPanel() {
  return {
    access_token: AdminPanel.getPanelValues("TeleserviceAPI").access_token,
    bot_token: AdminPanel.getPanelValues("TeleserviceAPI").bot_token,
    admin: AdminPanel.getPanelValues("TeleserviceAPI").admin,
    parseMode: AdminPanel.getPanelValues("TeleserviceAPI").parseMode,
    disableWebPreview: AdminPanel.getPanelValues("TeleserviceAPI").disableWebPreview,
    protectContent: AdminPanel.getPanelValues("TeleserviceAPI").protectContent,
    ispin: AdminPanel.getPanelValues("TeleserviceAPI").ispin
  };
}

// Function to add users
function addUser(userId) {
  let adminData = getAdminPanel();
  let url = API_URL + "adduser/";

  HTTP.post({
    url: url,
    headers: { "Content-type": "application/json" },
    body: {
      access_token: adminData.access_token,
      bot_token: adminData.bot_token,
      user_id: userId
    },
    success: libPrefix + "onApiResponse",
    error: libPrefix + "onApiResponseError"
  });
}

// Function to make an API call for broadcasting
function apiCall(options) {
  let headers = {
    "Content-type": "application/json",
    "Accept": "application/json"
  };

  let params = {
    url: API_URL + options.url,
    body: options.fields,
    headers: headers,
    success: libPrefix + "onApiResponse " + options.onSuccess,
    error: libPrefix + "onApiResponseError"
  };

  HTTP.post(params);
}

// Function to handle API response
function onApiResponse() {
  let options = JSON.parse(content);
  if (options.error) {
    Bot.sendMessage("Error: " + options.error.message + "\nPlease check your settings or contact support.");
  } else {
    Bot.runCommand(params, options);
  }
}

// Function to handle API error
function onApiResponseError() {
  Bot.sendMessage("An error occurred: " + content + "\nPlease verify your settings and try again. If the problem persists, contact support.");
}

// Function to broadcast messages
function broadcast(options) {
  let adminData = getAdminPanel();

  if (!options) {
    Bot.sendMessage("Error: Missing options for broadcasting.\nPlease provide the necessary parameters and try again.");
    return;
  }

  options.fields = {
    method: options.method,
    text: options.text,
    access_token: adminData.access_token,
    bot_token: adminData.bot_token,
    admin: adminData.admin,
    type: options.type,
    file_id: options.file_id,
    caption: options.caption,
    parseMode: adminData.parseMode,
    disableWebPreview: adminData.disableWebPreview,
    protectContent: adminData.protectContent,
    ispin: adminData.ispin
  };

  options.url = "broadcast/";
  options.onSuccess = options.onBroadcast;

  apiCall(options);
}

// Export functions to be used elsewhere
publish({
  setup: setupAdminPanel,
  useradd: addUser,
  broadcast: broadcast
});

// Set up event listeners for various events
on(libPrefix + "onApiResponse", onApiResponse);
on(libPrefix + "onApiResponseError", onApiResponseError);

// Initialize the admin panel setup
setupAdminPanel();
