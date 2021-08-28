import { createLogger, format, transports } from 'winston'
import 'winston-daily-rotate-file'
import moment from 'moment'
import path from 'path'

// log 저장 위치
const appDir = path.dirname(require.main.filename)
const logDir = appDir + '/../logs/'
const YYMMDD = moment().format('YYYY-MM-DD')

// log 포맷 정의
const { combine, printf } = format
const loggingFormat = printf((info) => {
  const timeStamp = moment().format('YYYY-MM-DD HH:mm:ss')
  return `${timeStamp} ${info.level} ${info.message}`
})

// log Level 정의
const infoTransport = new transports.File({
  level: 'info',
  filename: `${logDir}/${YYMMDD}.log`
})

const errorTransport = new transports.File({
  level: 'error',
  filename: `${logDir}/error/${YYMMDD}.log`
})

const logger = createLogger({
  format: combine(
    loggingFormat,
  ),
  transports: [infoTransport, errorTransport],
})

const stream = {
  write: message => {
    logger.info(message.substring(0, message.lastIndexOf('\n')))
  },
}

if (process.env.NODE_ENV !== 'production') {
  /*logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple()
    )
  }));*/
}

export {
  logger,
  stream,
}
