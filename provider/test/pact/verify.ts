import { Verifier } from '@pact-foundation/pact';
import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../src/app.module';

async function startApp(): Promise<{ app: INestApplication; port: number }> {
  const app = await NestFactory.create(AppModule);
  const server = await app.listen(0);
  const address = server.address();
  const port = typeof address === 'string' ? 0 : address?.port || 0;
  return { app, port };
}

async function main() {
  const { app, port } = await startApp();
  try {
    const result = await new Verifier({
      providerBaseUrl: `http://localhost:${port}`,
      pactBrokerUrl: process.env.PACT_BROKER_BASE_URL || 'http://localhost:9292',
      pactBrokerUsername: process.env.PACT_BROKER_USERNAME,
      pactBrokerPassword: process.env.PACT_BROKER_PASSWORD,
      provider: 'ProductProvider',
      publishVerificationResult: true,
      providerVersion: process.env.GIT_SHA || 'dev',
      providerVersionBranch: process.env.GITHUB_REF_NAME || 'main',
      consumerVersionSelectors: [{ latest: true }],
      enablePending: true
    }).verifyProvider();
    // eslint-disable-next-line no-console
    console.log(result);
  } finally {
    await app.close();
  }
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});


