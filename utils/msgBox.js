import { spawn } from 'child_process';
import config from '../config/adjuster.config.js';

let props = {
    enabled: config?.msgBoxNotify?.enabled ?? false, 
    lastCallTime: 0, 
    cooldown: config?.msgBoxNotify?.cooldown || 5000
};

export default function messageBox(message) {
    if(!props.enabled) return;

    const currentTime = Date.now();
    if (currentTime - props.lastCallTime < props.cooldown) return;
    props.lastCallTime = currentTime; 

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
    spawn("powershell.exe", ["-Command", command]);
} 