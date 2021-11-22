
use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program] //macros - that attach code to modules -- sort of like class inheritance
pub mod myepicproject { //pub mod tells basically  this is a rust module
  use super::*;
  //start_stuff_off is like a function declaration which uses context as param
  pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> ProgramResult {
       // Get a reference to the account.
    let base_account = &mut ctx.accounts.base_account; //&mut is a mutable reference to base account
    // Initialize total_gifs.
    base_account.total_gifs = 0;
    Ok(())
  }

  pub fn add_gif(ctx: Context<AddGif>) -> ProgramResult {

    let base_account = &mut ctx.accounts.base_account;
    base_account.total_gifs += 1;
    Ok(())
  }
}


//attaching variables to the startstuffoff context
#[derive(Accounts)] //another macro
pub struct StartStuffOff<'info> {
#[account(init, payer = user, space = 9000)] // telling solana how we want to initialize base account, init: tells solana to create a new account, payer : who is paying for the account to be created, basically the user calling this function, space: 9000bytes being allocated to the pgram
pub base_account: Account<'info, BaseAccount>,
#[account(mut)] //mut means mutable reference
pub user: Signer<'info>,
pub system_program: Program<'info, System>,//reference to the program that is running solana 

}

// Tell Solana what we want to store on this account. basically base account holds integers namely count of total_gifs
#[account]
pub struct BaseAccount {
    pub total_gifs: u64,
}