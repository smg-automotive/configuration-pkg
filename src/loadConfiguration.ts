import path from 'path'
import fs from 'fs'
import { config } from 'dotenv'

export interface Configuration {
  [key: string]: string | number | boolean
}

if (typeof window !== 'undefined') {
  throw new Error(
    "It looks like you're loading the configuration in the browser. Use process.env.VARIABLE instead"
  )
}

const loadEnvFile = (configPath: string) => {
  const configuration = config({ path: configPath })

  // eslint-disable-next-line no-console
  console.info(`> Loading configuration from ${configPath}`)

  if (configuration.error) {
    throw configuration.error
  }

  return configuration.parsed
}

const loadConfiguration = (): Configuration => {
  const envDir = path.join(process.cwd(), '.env')
  const environments = fs.readdirSync(envDir)

  const nodeEnv = process.env.NODE_ENV || 'development'

  const env = process.env.CONFIG_ENV || nodeEnv
  const localEnv = `${env}.local`
  const version = process.env.VERSION || 'none'

  process.env.CONFIG_ENV = env

  if (!environments.includes(env)) {
    throw new Error(`Invalid environment: ${env}`)
  }

  const configPath = path.resolve(envDir, env)
  const configuration = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    CONFIG_ENV: env,
    VERSION: version,
    ...loadEnvFile(configPath),
  }

  if (environments.includes(localEnv)) {
    const localConfiguration = loadEnvFile(path.resolve(envDir, localEnv))
    return { ...configuration, ...localConfiguration }
  }

  return configuration
}

export default loadConfiguration
