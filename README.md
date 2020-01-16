# AESOP
Meet Aesop: the lightweight Storybook preview extension.
 
This humble helper displays your Storybook alongside a codebase for more responsive workflow. It integrates with existing Storybook addons and features, and it is optimized to use minimal system resources.
 
## Features
If you are working in a project folder on a Storybook-enabled application, Aesop will run a Storybook process at startup and display the same suite you're used to right inside Visual Studio Code as an attached child process. Or, if you're used to starting up your Storybook from the CLI with additional arguments, Aesop won't impede your workflow — it understands Node processes, and will happily retrieve your running Storybook.
 
## Requirements
Aesop only depends on the ps-node library. This is used to simplify certain lookup functions while accessing running Node processes, but will likely be removed in a future version to make Aesop dependency-free. If your system does not support Netstat, you may experience some troubles using this beta release.
 
## Extension Settings
Because Aesop is lightweight, it is also minimal config. It contributes one hotkey command chord to activate: CTRL / CMD K + A
 
The Aesop team aims to provide further customization options and improved UI integration within Visual Studio Code as development continues. Currently, Storybook's default configuration contributes default port and host values that are only meant to be reserved for future versions.
 
## Release Notes
Please contact the developers at https://github.com/Async-Aesop/aesop with comments, questions, and any features you would like to see in a future version of Aesop.
 
### 0.1.0
Aesop is pleased to make your acquaintance. Happy testing.

