import { spawn, execSync} from 'child_process';
import os from 'os'
import config from '../config/adjuster.config.js';

function getNotifierType() {
    const platform = os.platform();

    // Windows
    if (platform === 'win32') {
        return 'windows';
    }
    
    // Linux or macOS
   if (platform === 'linux' || platform === 'darwin') {
        const commands = ['kdialog', 'zenity', 'notify-send'];

        for (const cmd of commands) {
            try {
                execSync(`command -v ${cmd}`, { 
                    stdio: 'ignore',
                    shell: '/bin/bash'
                });
                return cmd;
            } catch {}
        }
        
        return 'linux-fallback';
    }
    
    return 'unsupported';
}

let props = {
    enabled: config?.msgBoxNotify?.enabled ?? false, 
    lastCallTime: 0, 
    cooldown: config?.msgBoxNotify?.cooldown || 5000,
    windowTitle: 'WFM Adjuster'
};

export default function messageBox(message) {
    if(!props.enabled) return;

    const currentTime = Date.now();
    if (currentTime - props.lastCallTime < props.cooldown) return;
    props.lastCallTime = currentTime;

    const notifierType = getNotifierType();
    const title = props.windowTitle;

    switch(notifierType) {
        case 'notify-send':
            // Notify in the corner
            spawn('notify-send', ['-u', 'normal', title, message]);
            break;

        case 'zenity':
            // Message Box GTK
            spawn('zenity', [
                '--info',
                '--title=' + title,
                '--text=' + message,
                '--width=400',
                '--ok-label=OK'
            ]);
            break;

        case 'kdialog':
            // Message Box KDE
            spawn('kdialog', [
                '--msgbox',
                message,
                '--title=' + title,
                '--icon=info'
            ]);
            break;

        case 'linux-fallback':
            console.warn('[!] MessageBox notifications unsupported on current system. Turn off in config.');
            break;

        case 'windows':
            // Windows Message Box
                const command = `
                    Add-Type -AssemblyName PresentationCore,PresentationFramework,PresentationFramework;
                    [System.Media.SystemSounds]::Beep.Play();
                    $window = New-Object System.Windows.Window;
                    $window.Topmost = $true;
                    $window.WindowStartupLocation = 'CenterScreen';
                    $window.Title = 'WFM Adjuster';
                    $window.SizeToContent = 'Width';
                    $window.Height = 100;  # set height
                    $window.ResizeMode = 'NoResize';

                    $textBlock = New-Object System.Windows.Controls.TextBlock;
                    $textBlock.Text = '${message}';
                    $textBlock.Margin = '5';

                    $button = New-Object System.Windows.Controls.Button;
                    $button.Content = 'Ok';
                    $button.Margin = '5';
                    $button.Width = 100;
                    $button.Add_Click({ $window.Close() });

                    $stackPanel = New-Object System.Windows.Controls.StackPanel;
                    $stackPanel.Children.Add($textBlock);
                    $stackPanel.Children.Add($button);
                    $window.Content = $stackPanel;

                    $window.ShowDialog() | Out-Null;
                `;
            spawn('powershell.exe', ['-Command', command]);
            break;

        default:
            console.warn('[!] MessageBox notifications unsupported on current system. Turn off in config.');
    }
}