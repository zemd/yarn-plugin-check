import { CommandContext, Plugin } from '@yarnpkg/core';
import { Command, Option } from 'clipanion';
import net from 'net'
import t from 'typanion'
import chalk from 'chalk'
import execa from 'execa'
import process from 'process';

class CheckCommand extends Command<CommandContext> {
  static usage = Command.Usage({
    description: 'Check for something',
    details: 'This command will check',
    examples: [[
      'Check port',
      'yarn check --port=8080 --message="Web port 8080 currently in use"'
    ]],
  })

  static paths = [[`check`]];

  command = Option.String('-c,--command', {
    description: 'Command to be executed and checked'
  });

  port = Option.String('-p,--port', {
    description: 'Port to be checked',
    validator: t.isNumber()
  });

  host = Option.String('-h,--host', '127.0.0.1', {
    description: 'Host to be checked'
  });

  message = Option.String('-m,--message', {
    description: 'Message'
  });

  verbose = Option.Boolean('-v,--verbose', false, {
    description: '',
  });

  async checkPort() {
    return new Promise((resolve, reject) => {
      const client = new net.Socket();
      client.once('connect', () => {
        reject('The port is in use');
      });
      client.once('error', () => {
        resolve();
      });
      client.connect({ port: this.port, host: this.host }, function () {
        if (client) {
          // client.removeAllListeners('connect');
          // client.removeAllListeners('error');
          client.end();
          client.destroy();
          client.unref();
        }
      });
    })
  }

  async execute() {
    if (this.port) {
      try {
        await this.checkPort();
        const message = `✓ The port ${this.port} is available.`
        this.context.stdout.write(`${chalk.green(message)}\n`);
      } catch(error) {
        const message = `× ${this.message || `The port ${this.port} is in use.`}`
        this.context.stdout.write(`${chalk.red(message)}\n`);
        process.abort();
      }
    }
    if (this.command) {
      if (this.verbose) {
        this.context.stdout.write(`> Executing ${chalk.cyan(this.command)}\n`);
        this.context.stdout.write(`> Using cwd: ${chalk.blue(this.context.cwd)}\n\n`);
      }
      try {
        const result = execa.commandSync(this.command.trim(), {
          cwd: this.context.cwd,
          stdout: this.verbose ? this.context.stdout : undefined,
          stderr: this.verbose ? this.context.stderr : undefined,
        });
        if (result.exitCode > 0) {
          this.context.stdout.write(`${chalk.red('The command failed. ' + (this.message || ''))}\n`);
          process.abort();
        } else {
          this.context.stdout.write(`${chalk.green('The command didn\'t fail. ' + (this.message || ''))}\n`);
        }
      } catch(error) {
        if (this.verbose) {
          this.context.stderr.write(error.stack);
          this.context.stderr.write('\n');
        }
        this.context.stdout.write(`${chalk.red('The command failed. ' + (this.message || ''))}\n`);
        process.abort();
      }
    }
  }
}

const plugin: Plugin = {
  commands: [
    CheckCommand,
  ],
};

export default plugin;
