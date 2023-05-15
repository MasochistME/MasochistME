import fs from "fs";
import readline from "readline";

import chalk from "chalk";
import Confirm from "prompt-confirm";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const init = () => {
  console.clear();

  const question = `${chalk.blue("What is the keyword of your command?")}
${chalk.white.bold("Name: ")}`;

  rl.question(question, keyword => {
    const prompt = new Confirm(
      `Is the keyword "${chalk.white(keyword)}" correct?`,
    );

    prompt.ask(keywordCorrect => {
      if (keywordCorrect) createCommand(keyword);
      process.exit();
    });
  });
};

init();

/**
 * Creates a new command with the given keyword.
 */
const createCommand = name => {
  const command = name.toLowerCase();
  const source = `./scripts/_CommandTemplate`;
  const destination = `./src/commands/${command}`;

  log.INFO(`✓ Validating your input...`);

  if (fs.existsSync(destination)) {
    log.WARN(
      `${chalk.red(
        "⚠️  Error: ",
      )} A component with the name "${command}" already exists.`,
    );
    process.exit(1);
  }

  fs.mkdirSync(destination);
  log.INFO(`✓ Created command folder: "${chalk.white.bold(destination)}"`);

  ["logic.ts", "builder.ts", "interactions.ts"].forEach(path => {
    replaceTemplateWithCmdKeyword(source, destination, path, path, command);
    console.log(`✓ Generated ${path} file...`);
  });

  fs.appendFileSync(
    "./src/commands/builders.ts",
    `\r\n
    // TODO Don't forget to edit this!
    //
    // import { ${command}Builder } from "./${command}/builder";
    // export const customCommands = [${command}Builder];`,
  );
  fs.appendFileSync(
    "./src/commands/logic.ts",
    `\r\n
    // TODO Don't forget to edit this!
    //
    // import { ${command} } from "./${command}/logic";
    // export const commandsFunctions: CommandFn[] = [${command}];`,
  );
  log.INFO("✓ Exported logic and builder files...");

  fs.appendFileSync(
    "./src/interactions/autocomplete.ts",
    `\r\n
    // TODO Don't forget to edit this!
    // 
    // import { ${command}Autocomplete } from "commands/${command}/interactions";
    //
    // const ${command.toUpperCase()}_CMDS = ["${command}"];
    //
    // export const handleAutocomplete = (interaction: AutocompleteInteraction) => {
    //  if (${command.toUpperCase()}_CMDS.includes(interaction.commandName)) {
    //    ${command}Autocomplete(interaction);
    //  }
    //};
    `,
  );
  log.INFO("✓ Created a sample interaction module...");

  log.INFO(
    `${chalk.blue("Command")} ${chalk.green.bold(name)} ${chalk.blue(
      "created!",
    )}`,
  );
};

/*************************
 *         UTILS         *
 *************************/

const log = {
  INFO: content => {
    console.log(`${new Date().toLocaleString()} - [INFO] - ${content}`);
  },
  WARN: content => {
    console.trace(`${new Date().toLocaleString()} - [WARN] - ${content}`);
  },
};

const errorCb = (dir, err) => {
  if (err) {
    log.WARN(`⚠️ ${chalk.red("\n\nError: ")} ${err}`);
    log.INFO(`⚠️ Undoing changes...`);

    fs.rmdirSync(dir, { recursive: true });
    process.exit(1);
  }
};

const replaceTemplateWithCmdKeyword = (
  sourcePath,
  destinationPath,
  sourceFileName,
  destinationFileName,
  cmdKeyword,
) => {
  try {
    const file = fs.readFileSync(`${sourcePath}/${sourceFileName}`, "utf8");
    const updatedFile = file.replace(/template/g, cmdKeyword);
    fs.writeFileSync(`${destinationPath}/${destinationFileName}`, updatedFile);
  } catch (error) {
    errorCb(destinationPath, error);
  }
};
