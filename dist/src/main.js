"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
const errors_interceptor_1 = require("./common/interceptors/errors.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor(), new errors_interceptor_1.ErrorsInterceptor());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Nexo Fintech API')
        .setDescription('API de pagamentos com carteiras, transferências e PIX')
        .setVersion('0.1.0')
        .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'apiKey')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document);
    const port = process.env.PORT ? Number(process.env.PORT) : 3000;
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map