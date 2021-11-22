const anchor = require("@project-serum/anchor");
const { SystemProgram } = anchor.web3; //system program

const main = async () => {
  console.log("INITIALIZING TEST");
  const provider = anchor.Provider.env(); //creating and setting a provider before we update it
  anchor.setProvider(provider); //setting provider for anchor
  const program = anchor.workspace.Myepicproject;

  //declare a baseaccount and store the newly created keypair for the program to use --- anchor.web3.Keypair.generate() Creates the credentials for the baseaccount
  const baseAccount = anchor.web3.Keypair.generate();
  const tx = await program.rpc.startStuffOff({
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [baseAccount],
  });

  console.log(" ✍️ ✍️ ✍️ transaction signatoooor ✍️ ✍️ ✍️✍️ ✍️ ✍️", tx);

  let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log("👀 THIS IS THE GIF COUNT", account.totalGifs.toString());

  //calling-addgif

  await program.rpc.addGif("https://media.giphy.com/media/GRSnxyhJnPsaQy9YLn/giphy.gif",{
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    },
  });

  //calling account again to get newGif count after using addGif
  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log("👀 THIS IS THE new GIF COUNT", account.totalGifs.toString());

  console.log("👀👀👀THIS IS THE GIF LIST👀👀👀", account.gifList)
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
