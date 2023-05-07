# CDX's Development Framework Manual
This is a simple manual designed to assist in configuring and fixing any errors that occur whilst using **CDX's Development Framework**.

## Getting Started

There's only one step before you can get your bot up and running! You'll have to create a new `.env` file in the main directory. After which, you will have to paste this and then fill out the fields:

```

# LOGIN

TOKEN=123 # Enter your bot token here

# SLASH COMMANDS

APP_ID=123 # The application Id
GUILD_ID=123 # The guild Id for commands (set to NONE if you'd like global commands)

```
**If you have any struggles with this step, contact developer.**

## Configuration

You can edit the main configuration file at `/config/main.json`. The file should look like the following:
```
{
    "activity": "disabled -- view manual to configure"
}
```
Underneath is a guide on how to properly configure each field.

### Activity

To configure activity, you must setup the field as so:
```
{
    ...
    "activtiy": {
        "type": "",
        "text": ""
    }
    ...
}
```
Set type to one of the following: `playing`, `watching`, `listening` or `competing`. The `streaming` acitvity type is not current supported. Here's an example of how it should look:
```
{
    ...
    "activtiy": {
        "type": "playing",
        "text": "Minecraft"
    }
    ...
}
```