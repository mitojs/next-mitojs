#![deny(clippy::all)]
// #[cfg(not(target_os = "windows"))]
#[macro_use]
extern crate napi_derive;
use std::env;

use libc::{getrlimit, rlimit, RLIMIT_NOFILE, RLIM_INFINITY};

#[napi]
pub fn get_max_open_file_num() -> i64 {
  const NOT_SUPPORT_FLAG: i64 = -1;
  if env::consts::OS != "windows" {
    let mut limit: rlimit = rlimit {
      rlim_cur: 0,
      rlim_max: 0,
    };
    if unsafe { getrlimit(RLIMIT_NOFILE, &mut limit) } == 0 {
      let max_open_file_num = if limit.rlim_cur == RLIM_INFINITY {
        NOT_SUPPORT_FLAG
      } else {
        limit.rlim_cur as i64
      };
      println!(
        "print max_open_file_num: {}, {}",
        limit.rlim_max, limit.rlim_cur
      );
      return max_open_file_num;
    }
  }
  NOT_SUPPORT_FLAG
}
