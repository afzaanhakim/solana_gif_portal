
use anchor_lang::preulude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program] //macros - that attach code to modules -- sort of like class inheritance
pub mod myepicproject { //pub mod tells basically  this is a rust module
  use super::*;
  //start_stuff_off is like a function declaration which uses context as param
  pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> ProgramResult {
    Ok(())
  }
}

#[derive(Accounts)] //another macro
pub struct StartStuffOff {}