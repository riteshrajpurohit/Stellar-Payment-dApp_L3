#![no_std]
use soroban_sdk::{contract, contractimpl, Env, Symbol};

const COUNTER: Symbol = Symbol::short("COUNTER");

#[contract]
pub struct CounterContract;

#[contractimpl]
impl CounterContract {
    /// Get the current value of the counter.
    pub fn get_counter(env: Env) -> u32 {
        env.storage().instance().get(&COUNTER).unwrap_or(0)
    }

    /// Increment the counter by 1.
    pub fn increment_counter(env: Env) -> u32 {
        let mut count: u32 = env.storage().instance().get(&COUNTER).unwrap_or(0);
        count += 1;
        env.storage().instance().set(&COUNTER, &count);
        env.events().publish((COUNTER, Symbol::short("increment")), count);
        count
    }
}
