# Ollama Windows Setup Guide 🦙

Follow these steps to get your local AI running:

1.  **Launch Ollama**:
    - Look for the **Ollama icon** in your Windows Start Menu.
    - Click it to start. You should see a small llama icon in your **System Tray** (bottom-right of your taskbar, near the clock).

2.  **Pull the Model**:
    - Open a **NEW** PowerShell or Command Prompt (this ensures the `ollama` command is recognized after installation).
    - Run this command:
      ```powershell
      ollama pull llama3
      ```
    - Wait for it to finish downloading (it's about 4.7GB).

3.  **Verify**:
    - Run `ollama list` to make sure `llama3` is in the list.

4.  **Restart Backend**:
    - Once the model is ready, I will update your code to use it!
