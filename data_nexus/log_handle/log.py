import logging

enable_python_logging = False

enable_log_info = True
enable_log_debug = True
enable_log_warning = True
enable_log_error = True
enable_log_critical = True


if enable_python_logging :
    logger = logging.getLogger(__name__)
    logging.basicConfig(format='%(asctime)s [%(levelname)s] %(message)s', filename='log.txt', level=logging.INFO)


def log_info(message):
    if enable_python_logging:
        logger.info(message)
    if enable_log_info:
        print("[INFO]", message)

def log_debug(message):
    if enable_python_logging:
        logger.debug(message)
    if enable_log_debug:
        print("[DEBUG]", message)
        
def log_warning(message):
    if enable_python_logging:
        logger.warning(message)
    if enable_log_warning:
        print("[WARNING]", message)
        
def log_error(message):
    if enable_python_logging:
        logger.error(message)
    if enable_log_error:
        print("[ERROR]", message)

def log_critical(message):
    if enable_python_logging:
        logger.critical(message)
    if enable_log_critical:
        print("[CRITICAL]", message)
