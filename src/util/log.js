import chalk from "chalk";

export function info(message) {
  console.log(`INFO: ${message}`);
}

export function error(message) {
  console.error(chalk.red(`ERROR: ${message}`));
}

export function success(message) {
  console.info(chalk.greenBright(`SUCCESS: ${message}`));
}

