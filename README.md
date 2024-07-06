# Teleservice Library Documentation

The Teleservice library provides functions to manage and check membership statuses in Telegram chats using the BJS (Bot JavaScript) platform on Bots.Business. This documentation outlines the available functions, their usage, and best practices for integration.

## Overview

The Teleservice library simplifies the process of managing user memberships in Telegram chats. It offers key functionalities such as checking membership statuses and handling the results through callbacks.

## Functions

### `checkMembership(botToken, userId, chatIds, onSuccess)`

Checks the membership status of a user (`userId`) in multiple Telegram chats (`chatIds`) using the specified Telegram bot (`botToken`). Upon completion, it triggers a callback (`onSuccess`) with the results.

#### Parameters:
- `botToken` (string): Telegram bot token used for API requests.
- `userId` (string): User ID whose membership status is being checked.
- `chatIds` (array of strings): Array of chat IDs where membership status is to be checked.
- `onSuccess` (string): Callback command to execute upon successful completion, receiving the membership status results.

#### Example:
```javascript
Libs.Teleservice.checkMembership("YOUR_BOT_TOKEN", "USER_ID", ["CHAT_ID_1", "CHAT_ID_2"], "onCheckMembership");
```

### `isHaveError(botToken, userId, chatIds, onSuccess)`

Validates parameters passed to the `checkMembership` function to ensure they meet requirements.

#### Parameters:
- Same as `checkMembership` function.

#### Returns:
- `true` if there are errors in parameters; otherwise, `false`.

### `getApiUrl(botToken, userId, chatId)`

Constructs the API URL for querying Telegram's `getChatMember` method.

#### Parameters:
- `botToken` (string): Telegram bot token used for API requests.
- `userId` (string): User ID whose membership status is being checked.
- `chatId` (string): Chat ID where membership status is to be checked.

#### Returns:
- URL (string) for the API request.

### `storeUserStatus(content, params)`

Stores the user membership status response from the Telegram API and triggers further actions upon completion of all checks.

#### Parameters:
- `content` (string): JSON response from Telegram API.
- `params` (string): Additional parameters passed during HTTP request, including chatId, userId, onSuccess, and other chat IDs.

### `publish(functions)`

Publishes the `checkMembership` function to make it accessible as a library function (`Libs.Teleservice.checkMembership`).

#### Parameters:
- `functions` (object): Contains the functions to be published.

## Event Handling

The library uses event handling (`on`) to manage successful HTTP responses from the Telegram API, invoking `storeUserStatus` for processing.

## Usage

### Initialization

1. Include the Teleservice library in your BJS script.
2. Define `libPrefix` to customize storage prefixes.

### Calling `checkMembership`

Call `Libs.Teleservice.checkMembership` with appropriate parameters (`botToken`, `userId`, `chatIds`, `onSuccess`).

### Handling Results

Define a callback (`onSuccess`) to process membership status results.

## Best Practices

- Ensure all parameters (`botToken`, `userId`, `chatIds`, `onSuccess`) are correctly formatted and validated using `isHaveError`.
- Handle errors gracefully and provide informative error messages.
- Store and manage state using `Bot.setProperty` to maintain user membership statuses.
- Follow BJS synchronous execution limitations and event handling guidelines.

## Security Considerations

- Protect sensitive data such as `botToken` and `userId` from unauthorized access.
- Use HTTPS for API requests to ensure data integrity and security.
- Adhere to Telegram API rate limits and guidelines.

## Examples

Detailed examples and scenarios can be found in the accompanying documentation files (blockio.md, coinbase.md, etc.).

## Limitations

- BJS is synchronous; asynchronous operations and advanced JavaScript features are not supported.

## Support

For further assistance or questions, refer to the official documentation or contact support at [Bots.Business](https://bots.business).

Join our channel for updates and support: [Teleservices API](https://t.me/Teleservices_Api)

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
