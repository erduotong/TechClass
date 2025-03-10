//! 管理日志

use flexi_logger::{detailed_format, Cleanup, Criterion, Duplicate, FileSpec, Naming};
use lazy_static::lazy_static;
use log::{debug, error, info, trace, warn};

use crate::contestants::{app_info, PATH_BASIC};

const LOG_SIZE: u64 = 10 * 1024 * 1024;
const LOG_PREFIX: &str = app_info::NAME;
const LOG_SUFFIX: &str = "log";
const LOG_LEVEL: &str = env!("RUST_LOG_LEVEL");
lazy_static! {
    pub static ref PATH_LOG: std::path::PathBuf = PATH_BASIC.join("logs");
}

/// 初始化日志系统
pub fn init() {
    flexi_logger::Logger::try_with_str(LOG_LEVEL)
        .unwrap()
        .log_to_file(
            FileSpec::default()
                .basename(LOG_PREFIX)
                .directory(PATH_LOG.as_path())
                .suffix(LOG_SUFFIX),
        )
        .rotate(
            Criterion::Size(LOG_SIZE),
            Naming::Timestamps,
            Cleanup::KeepLogFiles(10),
        )
        .write_mode(flexi_logger::WriteMode::BufferAndFlush)
        .duplicate_to_stdout(Duplicate::All)
        .format_for_files(detailed_format)
        .start()
        .unwrap();
    info!("日志已初始化");
    info!("{} 版本: {}", app_info::NAME, app_info::VERSION);
    info!("日志级别: {}", LOG_LEVEL);
}
fn process_content(content: String) -> String {
    let parsed_content = serde_json::from_str::<String>(&content).unwrap_or(content);
    format!("[前端] {}", parsed_content)
}
#[tauri::command]
/// 从前端以trace的等级记录日志
pub fn log_trace(content: String) {
    trace!("{}", process_content(content));
}

#[tauri::command]
/// 从前端以debug的等级记录日志
pub fn log_debug(content: String) {
    debug!("{}", process_content(content));
}

#[tauri::command]
/// 从前端以info的等级记录日志
pub fn log_info(content: String) {
    info!("{}", process_content(content));
}

#[tauri::command]
/// 从前端以warn的等级记录日志
pub fn log_warn(content: String) {
    warn!("{}", process_content(content));
}

#[tauri::command]
/// 从前端以error的等级记录日志
pub fn log_error(content: String) {
    error!("{}", process_content(content));
}
