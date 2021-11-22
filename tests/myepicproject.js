const anchor = require("@project-serum/anchor");

const main = async () => {
  console.log("INITIALIZING TEST");

  anchor.setProvider(anchor.Provider.env());
  const program = anchor.workspace.Myepicproject;
  const tx = await program.rpc.startStuffOff();

  console.log("transaction signatoooor", tx);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
runMain();
