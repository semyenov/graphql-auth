-- CreateTable
CREATE TABLE "VerificationToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usedAt" DATETIME,
    CONSTRAINT "VerificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LoginAttempt" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "OidcClient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "clientSecret" TEXT,
    "clientName" TEXT NOT NULL,
    "redirectUris" TEXT NOT NULL,
    "postLogoutRedirectUris" TEXT,
    "scope" TEXT NOT NULL DEFAULT 'openid profile email',
    "grantTypes" TEXT NOT NULL,
    "responseTypes" TEXT NOT NULL,
    "tokenEndpointAuthMethod" TEXT NOT NULL DEFAULT 'client_secret_basic',
    "applicationType" TEXT NOT NULL DEFAULT 'web',
    "clientUri" TEXT,
    "logoUri" TEXT,
    "tosUri" TEXT,
    "policyUri" TEXT,
    "jwksUri" TEXT,
    "jwks" TEXT,
    "subjectType" TEXT NOT NULL DEFAULT 'public',
    "idTokenSignedResponseAlg" TEXT NOT NULL DEFAULT 'RS256',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "OidcSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "clientId" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "nonce" TEXT,
    "state" TEXT,
    "codeChallenge" TEXT,
    "codeChallengeMethod" TEXT,
    "authTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OidcSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OidcSession_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "OidcClient" ("clientId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OidcAuthorizationCode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "clientId" TEXT NOT NULL,
    "redirectUri" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "nonce" TEXT,
    "codeChallenge" TEXT,
    "codeChallengeMethod" TEXT,
    "usedAt" DATETIME,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OidcAuthorizationCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OidcAuthorizationCode_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "OidcClient" ("clientId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OidcAccessToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "clientId" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OidcAccessToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OidcAccessToken_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "OidcClient" ("clientId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OidcRefreshToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "clientId" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OidcRefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OidcIdToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "jti" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "clientId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "nonce" TEXT,
    "authTime" DATETIME NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OidcIdToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RefreshToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "family" TEXT NOT NULL DEFAULT 'default',
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_RefreshToken" ("createdAt", "expiresAt", "id", "token", "userId") SELECT "createdAt", "expiresAt", "id", "token", "userId" FROM "RefreshToken";
DROP TABLE "RefreshToken";
ALTER TABLE "new_RefreshToken" RENAME TO "RefreshToken";
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");
CREATE INDEX "RefreshToken_token_idx" ON "RefreshToken"("token");
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "status" TEXT NOT NULL DEFAULT 'active',
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerifiedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("createdAt", "email", "emailVerified", "id", "name", "password", "role", "status", "updatedAt") SELECT "createdAt", "email", "emailVerified", "id", "name", "password", "role", "status", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE INDEX "VerificationToken_token_idx" ON "VerificationToken"("token");

-- CreateIndex
CREATE INDEX "VerificationToken_userId_idx" ON "VerificationToken"("userId");

-- CreateIndex
CREATE INDEX "VerificationToken_type_idx" ON "VerificationToken"("type");

-- CreateIndex
CREATE INDEX "LoginAttempt_email_idx" ON "LoginAttempt"("email");

-- CreateIndex
CREATE INDEX "LoginAttempt_createdAt_idx" ON "LoginAttempt"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "OidcClient_clientId_key" ON "OidcClient"("clientId");

-- CreateIndex
CREATE INDEX "OidcClient_clientId_idx" ON "OidcClient"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "OidcSession_sessionId_key" ON "OidcSession"("sessionId");

-- CreateIndex
CREATE INDEX "OidcSession_sessionId_idx" ON "OidcSession"("sessionId");

-- CreateIndex
CREATE INDEX "OidcSession_userId_idx" ON "OidcSession"("userId");

-- CreateIndex
CREATE INDEX "OidcSession_clientId_idx" ON "OidcSession"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "OidcAuthorizationCode_code_key" ON "OidcAuthorizationCode"("code");

-- CreateIndex
CREATE INDEX "OidcAuthorizationCode_code_idx" ON "OidcAuthorizationCode"("code");

-- CreateIndex
CREATE INDEX "OidcAuthorizationCode_userId_idx" ON "OidcAuthorizationCode"("userId");

-- CreateIndex
CREATE INDEX "OidcAuthorizationCode_clientId_idx" ON "OidcAuthorizationCode"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "OidcAccessToken_token_key" ON "OidcAccessToken"("token");

-- CreateIndex
CREATE INDEX "OidcAccessToken_token_idx" ON "OidcAccessToken"("token");

-- CreateIndex
CREATE INDEX "OidcAccessToken_userId_idx" ON "OidcAccessToken"("userId");

-- CreateIndex
CREATE INDEX "OidcAccessToken_clientId_idx" ON "OidcAccessToken"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "OidcRefreshToken_token_key" ON "OidcRefreshToken"("token");

-- CreateIndex
CREATE INDEX "OidcRefreshToken_token_idx" ON "OidcRefreshToken"("token");

-- CreateIndex
CREATE INDEX "OidcRefreshToken_userId_idx" ON "OidcRefreshToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "OidcIdToken_jti_key" ON "OidcIdToken"("jti");

-- CreateIndex
CREATE INDEX "OidcIdToken_jti_idx" ON "OidcIdToken"("jti");

-- CreateIndex
CREATE INDEX "OidcIdToken_userId_idx" ON "OidcIdToken"("userId");
