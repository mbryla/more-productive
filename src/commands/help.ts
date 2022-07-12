// prettier-ignore
export const help = () => {
    console.log(`usage: mp <command> [<args>]

Supported commands:
    fix [year-month]                Creates 8h enries in days without entries, defaults to current month
    help                            Lists available commands
    services <name>                 Searches for services (partially) matching name
    status [year-month] [verbose]   Checks status for given month, defaults to current month
    test                            Verify authentication using provided environment variables
`) ;
};
