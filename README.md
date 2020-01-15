# AESOP
Meet Aesop: a lightweight, open-source Storybook helper extension.

This humble helper previews your Storybook alongside your codebase for a responsive workflow. It should integrate with nearly all existing Storybook addons and features, and it is optimized to use minimal system resources. If Aesop runs your Storybook server, that process will run as an attached child process to Aesop.

## Features
If you are working in a project folder on a Storybook-enabled application, Aesop will run a Storybook process at startup and display the same suite you're used to right inside Visual Studio Code.

If you're used to starting up your Storybook from the CLI with additional arguments, Aesop won't impede your workflow — it understands Node processes, and will happily retrieve your running Storybook.

## Requirements
Aesop only depends on the ps-node library. This is used to simplify certain lookup functions while accessing running Node processes, but will likely be removed in a future version to make Aesop dependency-free.

If your system does not support Netstat...

## Extension Settings
Because Aesop is lightweight, it is also minimal config. It contributes one hotkey command chord to activate: CTRL / CMD K + A

The Aesop team aims to provide further customization options and improved UI integration within Visual Studio Code as development continues. Currently, Storybook's default configuration contributes default port and host values that are only meant to be reserved for future versions.

## Release Notes
Please contact the developers at https://github.com/Async-Aesop/aesop with comments, questions, and any features you would like to see in a future version of Aesop.

### 1.0.0
Aesop is pleased to make your acquaintance. Happy testing.