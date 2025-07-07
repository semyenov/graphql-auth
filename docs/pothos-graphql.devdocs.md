# Source: https://pothos-graphql.dev/docs/

## URL: https://pothos-graphql.dev/docs/

Title: Overview

URL Source: https://pothos-graphql.dev/docs/

Markdown Content:
Overview

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 3: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

Overview

# Overview

![Image 4: Pothos](https://pothos-graphql.dev/_next/static/media/logo-name-auto.893a025d.svg)

Pothos is a plugin based GraphQL schema builder for typescript.

It makes building graphql schemas in typescript easy, fast and enjoyable. The core of Pothos adds 0 overhead at runtime, and has `graphql` as its only dependency.

Pothos is the most type-safe way to build GraphQL schemas in typescript, and by leveraging type inference and typescript's powerful type system Pothos requires very few manual type definitions and no code generation.

Pothos has a unique and powerful plugin system that makes every plugin feel like its features are built into the core library. Plugins can extend almost any part of the API by adding new options or methods that can take full advantage of the Pothos type system.

## [Hello, World](https://pothos-graphql.dev/docs/#hello-world)

```
import { createYoga } from 'graphql-yoga';
import { createServer } from 'node:http';
import SchemaBuilder from '@pothos/core';

const builder = new SchemaBuilder({});

builder.queryType({
  fields: (t) => ({
    hello: t.string({
      args: {
        name: t.arg.string(),
      },
      resolve: (parent, { name }) => `hello, ${name || 'World'}`,
    }),
  }),
});

const yoga = createYoga({
  schema: builder.toSchema(),
});

const server = createServer(yoga);

server.listen(3000, () => {
  console.log('Visit http://localhost:3000/graphql');
});
```

## [What sets Pothos apart](https://pothos-graphql.dev/docs/#what-sets-pothos-apart)

- Pothos was built from the start to leverage typescript for best-in-class type-safety.
- Pothos has a clear separation between the shape of your external GraphQL API, and the internal representation of your data.
- Pothos comes with a large plugin ecosystem that provides a wide variety of features while maintaining great interoperability between plugins.
- Pothos does not depend on code-generation or experimental decorators for type-safety.
- Pothos has been designed to work at every scale from small prototypes to huge Enterprise applications, and is in use at some of the largest tech companies including Airbnb and Netflix.

## [Plugins that make Pothos even better](https://pothos-graphql.dev/docs/#plugins-that-make-pothos-even-better)

[### Add GraphQL Add existing GraphQL types to your schema](https://pothos-graphql.dev/docs/plugins/add-graphql)[### Auth Add global, type level, or field level authorization checks to your schema](https://pothos-graphql.dev/docs/plugins/scope-auth)[### Complexity A plugin for defining and limiting complexity of queries](https://pothos-graphql.dev/docs/plugins/complexity)[### Dataloader Quickly define data-loaders for your types and fields to avoid n+1 queries.](https://pothos-graphql.dev/docs/plugins/dataloader)[### Directives Integrate with existing schema graphql directives in a type-safe way.](https://pothos-graphql.dev/docs/plugins/directives)[### Drizzle A plugin to support efficient queries through drizzles relational query builder API](https://pothos-graphql.dev/docs/plugins/drizzle)[### Errors A plugin for easily including error types in your GraphQL schema and hooking up error types to resolvers.](https://pothos-graphql.dev/docs/plugins/errors)[### Mocks Add mock resolvers for easier testing](https://pothos-graphql.dev/docs/plugins/mocks)[### Prisma A plugin for more efficient integration with prisma that can help solve n+1 issues and more efficiently resolve queries](https://pothos-graphql.dev/docs/plugins/prisma)[### Relay Easy to use builder methods for defining relay style nodes and connections, and helpful utilities for cursor based pagination.](https://pothos-graphql.dev/docs/plugins/relay)[### Simple Objects Define simple object types without resolvers or manual type definitions.](https://pothos-graphql.dev/docs/plugins/simple-objects)[### Smart Subscriptions Make any part of your graph subscribable to get live updates as your data changes.](https://pothos-graphql.dev/docs/plugins/smart-subscriptions)[### Sub-Graph Build multiple subsets of your graph to easily share code between internal and external APIs.](https://pothos-graphql.dev/docs/plugins/sub-graph)[### Tracing Add tracing for resolver execution, with support for opentelemetry, newrelic, century, logging, and custom tracers](https://pothos-graphql.dev/docs/plugins/tracing)[### With-Input Define fields with inline input objects](https://pothos-graphql.dev/docs/plugins/with-input)[### Zod Validation Validating your inputs and arguments](https://pothos-graphql.dev/docs/plugins/zod)

[Sponsors The generous people supporting Pothos development](https://pothos-graphql.dev/docs/sponsors)

### On this page

[Hello, World](https://pothos-graphql.dev/docs/#hello-world)[What sets Pothos apart](https://pothos-graphql.dev/docs/#what-sets-pothos-apart)[Plugins that make Pothos even better](https://pothos-graphql.dev/docs/#plugins-that-make-pothos-even-better)

---

# Crawl Statistics

- **Source:** https://pothos-graphql.dev/docs/
- **Depth:** 1
- **Pages processed:** 1
- **Crawl method:** api
- **Duration:** 3.16 seconds
- **Crawl completed:** 21/06/2025, 08:04:22

# Source: https://pothos-graphql.dev/docs/

## URL: https://pothos-graphql.dev/docs/

Title: Overview

URL Source: https://pothos-graphql.dev/docs/

Markdown Content:
Overview

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 3: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

Overview Hello, World

# Overview

![Image 4: Pothos](https://pothos-graphql.dev/_next/static/media/logo-name-auto.893a025d.svg)

Pothos is a plugin based GraphQL schema builder for typescript.

It makes building graphql schemas in typescript easy, fast and enjoyable. The core of Pothos adds 0 overhead at runtime, and has `graphql` as its only dependency.

Pothos is the most type-safe way to build GraphQL schemas in typescript, and by leveraging type inference and typescript's powerful type system Pothos requires very few manual type definitions and no code generation.

Pothos has a unique and powerful plugin system that makes every plugin feel like its features are built into the core library. Plugins can extend almost any part of the API by adding new options or methods that can take full advantage of the Pothos type system.

## [Hello, World](https://pothos-graphql.dev/docs/#hello-world)

```
import { createYoga } from 'graphql-yoga';
import { createServer } from 'node:http';
import SchemaBuilder from '@pothos/core';

const builder = new SchemaBuilder({});

builder.queryType({
  fields: (t) => ({
    hello: t.string({
      args: {
        name: t.arg.string(),
      },
      resolve: (parent, { name }) => `hello, ${name || 'World'}`,
    }),
  }),
});

const yoga = createYoga({
  schema: builder.toSchema(),
});

const server = createServer(yoga);

server.listen(3000, () => {
  console.log('Visit http://localhost:3000/graphql');
});
```

## [What sets Pothos apart](https://pothos-graphql.dev/docs/#what-sets-pothos-apart)

- Pothos was built from the start to leverage typescript for best-in-class type-safety.
- Pothos has a clear separation between the shape of your external GraphQL API, and the internal representation of your data.
- Pothos comes with a large plugin ecosystem that provides a wide variety of features while maintaining great interoperability between plugins.
- Pothos does not depend on code-generation or experimental decorators for type-safety.
- Pothos has been designed to work at every scale from small prototypes to huge Enterprise applications, and is in use at some of the largest tech companies including Airbnb and Netflix.

## [Plugins that make Pothos even better](https://pothos-graphql.dev/docs/#plugins-that-make-pothos-even-better)

[### Add GraphQL Add existing GraphQL types to your schema](https://pothos-graphql.dev/docs/plugins/add-graphql)[### Auth Add global, type level, or field level authorization checks to your schema](https://pothos-graphql.dev/docs/plugins/scope-auth)[### Complexity A plugin for defining and limiting complexity of queries](https://pothos-graphql.dev/docs/plugins/complexity)[### Dataloader Quickly define data-loaders for your types and fields to avoid n+1 queries.](https://pothos-graphql.dev/docs/plugins/dataloader)[### Directives Integrate with existing schema graphql directives in a type-safe way.](https://pothos-graphql.dev/docs/plugins/directives)[### Drizzle A plugin to support efficient queries through drizzles relational query builder API](https://pothos-graphql.dev/docs/plugins/drizzle)[### Errors A plugin for easily including error types in your GraphQL schema and hooking up error types to resolvers.](https://pothos-graphql.dev/docs/plugins/errors)[### Mocks Add mock resolvers for easier testing](https://pothos-graphql.dev/docs/plugins/mocks)[### Prisma A plugin for more efficient integration with prisma that can help solve n+1 issues and more efficiently resolve queries](https://pothos-graphql.dev/docs/plugins/prisma)[### Relay Easy to use builder methods for defining relay style nodes and connections, and helpful utilities for cursor based pagination.](https://pothos-graphql.dev/docs/plugins/relay)[### Simple Objects Define simple object types without resolvers or manual type definitions.](https://pothos-graphql.dev/docs/plugins/simple-objects)[### Smart Subscriptions Make any part of your graph subscribable to get live updates as your data changes.](https://pothos-graphql.dev/docs/plugins/smart-subscriptions)[### Sub-Graph Build multiple subsets of your graph to easily share code between internal and external APIs.](https://pothos-graphql.dev/docs/plugins/sub-graph)[### Tracing Add tracing for resolver execution, with support for opentelemetry, newrelic, century, logging, and custom tracers](https://pothos-graphql.dev/docs/plugins/tracing)[### With-Input Define fields with inline input objects](https://pothos-graphql.dev/docs/plugins/with-input)[### Zod Validation Validating your inputs and arguments](https://pothos-graphql.dev/docs/plugins/zod)

[Sponsors The generous people supporting Pothos development](https://pothos-graphql.dev/docs/sponsors)

### On this page

[Hello, World](https://pothos-graphql.dev/docs/#hello-world)[What sets Pothos apart](https://pothos-graphql.dev/docs/#what-sets-pothos-apart)[Plugins that make Pothos even better](https://pothos-graphql.dev/docs/#plugins-that-make-pothos-even-better)

---

## URL: https://pothos-graphql.dev/docs/migrations/v4

Title: v4.0

URL Source: https://pothos-graphql.dev/docs/migrations/v4

Markdown Content:
Migrating from Pothos 3.x to 4.0

The `4.0` release of Pothos is largely focused on updating 4 things:

1.  Improving outdated defaults to be more consistent and aligned with best practices
2.  Updating naming of some config options to be more consistent
3.  Updating minimum versions of peer dependencies
4.  Updating internal types to support some previously challenging plugin patterns

While the internals of Pothos have almost entirely been re-written, the public API surface should have a minimal changes for most users. The first 2 sets of changes will cover the majority of changes relevant to the majority of applications. To make the make the upgrade as simple as possible, some options were added to maintain the defaults and option names from `3.x` which are described in the simple upgrade section below.

- `typescript`: `5.0.2`
- `graphql`: `16.6.0`
- `node`: `18.0`

You can restore the 3.x defaults by adding the Defaults versions to both the SchemaTypes and the builder options:

This will restore all the defaults and config options from previous Pothos versions for both core and plugins.

If you are using `@pothos/plugin-validation`, it has been renamed to `@pothos/plugin-zod`, and a new validation plugin will be released in the future.

There are a number of new defaults and changes to options for various plugins. To fully upgrade to 4.0 see the full list of breaking changes below:

This section covers breaking API changes that can be automatically reverted by using the Simple Upgrade process described above.

Changes to types and classes outside the main Pothos API are described in the next section. Those changes will primarily affect other plugins and tools written for pothos, but may be relevant to some type helpers you have created.

### [Default field nullability](https://pothos-graphql.dev/docs/migrations/v4#default-field-nullability)

In previous versions of Pothos, fields were non-nullable by default. This is inconsistent with the rest of the GraphQL ecosystem, so the default is being changed to make fields nullable by default.

To restore the previous behavior you can set the `defaultFieldNullability` option when creating your builder:

Alternatively, fields can be updated to add `nullable: false` to the fields options.

### [Default ID Scalar types](https://pothos-graphql.dev/docs/migrations/v4#default-id-scalar-types)

The default types for the built in `ID` Scalar has been changed to more closely match the behavior of Javascript GraphQL server implementations:

This will make working with IDs in arguments and input types easier by avoiding unnecessary type checks to see if an `ID` is a `number` or `string`.

When returning an `ID` from a scalar you will be able to return a `string`, `number`, or `bigint`.

To restore the previous defaults you can customize the `ID` scalar types when creating your builder:

### [Renamed options](https://pothos-graphql.dev/docs/migrations/v4#renamed-options)

The base relay plugin options have moved from `relayOptions` to `relay` to be more consistent with options for other plugins.

### [New defaults](https://pothos-graphql.dev/docs/migrations/v4#new-defaults)

A number of the default values for relay options have changed:

- `clientMutationId`: Now defaults to `"omit"` and was previously `"required"`

  - `clientMutationId` was only required in early versions of the relay client, and is no-longer recommended.

- `cursorType`: Now defaults to `"String"` and was previously `"ID"`

  - The previous defaults were inconsistent about the type of a cursor. Cursors generally should not be treated as IDs as they are meant to indicate a position in a list, and may contain information specific to other filters or arguments applied to the connection.

- `brandLoadedObjects`: Now defaults to `true` and was previously `false`

  - This change will improve developer experience for most node implementations, as it removes the need for `isTypeOf` to be defined for most nodes.

- `edgesFieldOptions.nullable`: Now defaults to `{ list: options.defaultFieldNullability, items: true }` and was previously `{ list: false, items: true }`
- `nodeFieldOptions.nullable`: Now defaults to `options.defaultFieldNullability` and was previously `false`
  - This new default is intended to align with the relay connection spec, which does not expect connections to be NonNullable by default

To restore the previous defaults you can pass the old values when setting up the builder:

### [Nullable relations](https://pothos-graphql.dev/docs/migrations/v4#nullable-relations)

Previously the prisma would allow t.relation to define non-nullable fields using nullable relations. The plugin option now requires an `onNull` option to handle null relations on NonNullable fields

To restore the previous behavior you can set the `onNull` option to `'error'`, which will result in a runtime error when the field returns null

Alternatively you can mark the field as nullable:

`onNull` can also be set to a function that returns either a record matching the type of the relation, or a custom Error to throw when the relation is null.

`useGraphQLToolsUnorderedDirectives` has been nested inside a `directives` options object:

### [Renamed options](https://pothos-graphql.dev/docs/migrations/v4#renamed-options-1)

The base error plugin options have moved from `errorOptions` to `errors` to be more consistent with options for other plugins.

### [Renamed options](https://pothos-graphql.dev/docs/migrations/v4#renamed-options-2)

The base scope-auth plugin options have moved from `scopeAuthOptions` to `scopeAuth` to be more consistent with options for other plugins. The `authScopes` option has been moved to `scopeAuth.authScopes` to keep all options for the plugin in one options object.

### [Renamed options](https://pothos-graphql.dev/docs/migrations/v4#renamed-options-3)

The base validation plugin options have moved from `validationOptions` to `validation` to be more consistent with options for other plugins.

The `@pothos/plugin-authz` plugin has been removed, because the underlying `@graphql-authz/core` is not actively maintained, and has left critical security vulnerabilities unaddressed.

Unlike the defaults and config changes, the changes to the types and classes used throughout Pothos can't be easily made backwards compatibility with the 3.x releases. Below is a summary of the main changes made to the types and classes that may be used by plugins, helpers, or other libraries. Many of these types and classes are primarily intended for internal use, and should not affect most applications using pothos, but the changes are documented here to help upgrades for those of you building your own plugins, or using these types in your applications.

The 4.0 release is intended to allow pothos to become more modular and extensible. This requires Refs and many associated type helpers to propagate the SchemaTypes from the builder that originated them, meaning most of the changes listed below are adding `Types extends SchemaTypes` as the first generic argument to the type.

- `InputFieldBuilder`

  - Removed the `typename` argument from the constructor
  - Updated field methods to return a new `GenericInputRef`

- `InterfaceFieldBuilder`

  - Removed the `typename` argument from the constructor

- `ObjectFieldBuilder`

  - Removed the `typename` argument from the constructor

- `BaseTypeRef`

  - Added `SchemaTypes` as a new Generic parameter

- `EnumTypeRef`

  - Added `SchemaTypes` as a new Generic parameter

- `InputObjectRef`

  - Added `SchemaTypes` as a new Generic parameter

- `InputRef`

  - Added `SchemaTypes` as a new Generic parameter

- `OutputTypeRef`

  - Added `SchemaTypes` as a new Generic parameter

- `ListRef`

  - Added `SchemaTypes` as a new Generic parameter

- `InterfaceRef`

  - Added `SchemaTypes` as a new Generic parameter

- `ObjectRef`

  - Added `SchemaTypes` as a new Generic parameter

- `ScalarRef`

  - Added `SchemaTypes` as a new Generic parameter

- `UnionRef`

  - Added `SchemaTypes` as a new Generic parameter

- `FieldRef`

  - Added `SchemaTypes` as a new Generic parameter
  - removed the typename from constructor args
  - add the builder and Field options as arguments for the constructor

- `InputFieldRef`

  - Added `SchemaTypes` as a new Generic parameter
  - removed the typename and kind from constructor args
  - add the builder and Field options as arguments for the constructor
  - split argument refs into a new `ArgumentRef` class

- `*FieldThunk`

  - Updated to return a `GenericFieldRef<unknown>`

- `FieldMap`

  - Updated to `Record<string, GenericFieldRef<unknown>>;`

- `InputFieldMap`

  - Updated to `Record<string, GenericInputFieldRef<unknown>>;`

- `InputFieldsFromShape`

  - Added `SchemaTypes` as a new Generic parameter

- `InputShapeFromField`
  - Updated to accept a `GenericFieldRef`

The global interfaces for FieldOptions no-longer include the `resolve` option, which has moved to the `InferredFieldOptions` interface to allow plugins to replace or change the resolve functions types globally.

This means that when extending the `FieldOptionsByKind` interface, if you previously extended one of the built in Field option interfaces, you will need to update your types to include the `resolve` function types as well:

The `InferredFieldOptionsByKind` interface can be used to get the `resolve` option by default, but will also work for plugins that replace the `resolve` function with a different options for configuring how a field is resolved. Some custom object types may want to explicitly define a `resolve` option type, or omit it entirely (eg, the SimpleObject plugin does not use resolvers).

---

## URL: https://pothos-graphql.dev/docs

Title: Overview

URL Source: https://pothos-graphql.dev/docs

Markdown Content:
Overview

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 3: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

Overview

# Overview

![Image 4: Pothos](https://pothos-graphql.dev/_next/static/media/logo-name-auto.893a025d.svg)

Pothos is a plugin based GraphQL schema builder for typescript.

It makes building graphql schemas in typescript easy, fast and enjoyable. The core of Pothos adds 0 overhead at runtime, and has `graphql` as its only dependency.

Pothos is the most type-safe way to build GraphQL schemas in typescript, and by leveraging type inference and typescript's powerful type system Pothos requires very few manual type definitions and no code generation.

Pothos has a unique and powerful plugin system that makes every plugin feel like its features are built into the core library. Plugins can extend almost any part of the API by adding new options or methods that can take full advantage of the Pothos type system.

## [Hello, World](https://pothos-graphql.dev/docs#hello-world)

```
import { createYoga } from 'graphql-yoga';
import { createServer } from 'node:http';
import SchemaBuilder from '@pothos/core';

const builder = new SchemaBuilder({});

builder.queryType({
  fields: (t) => ({
    hello: t.string({
      args: {
        name: t.arg.string(),
      },
      resolve: (parent, { name }) => `hello, ${name || 'World'}`,
    }),
  }),
});

const yoga = createYoga({
  schema: builder.toSchema(),
});

const server = createServer(yoga);

server.listen(3000, () => {
  console.log('Visit http://localhost:3000/graphql');
});
```

## [What sets Pothos apart](https://pothos-graphql.dev/docs#what-sets-pothos-apart)

- Pothos was built from the start to leverage typescript for best-in-class type-safety.
- Pothos has a clear separation between the shape of your external GraphQL API, and the internal representation of your data.
- Pothos comes with a large plugin ecosystem that provides a wide variety of features while maintaining great interoperability between plugins.
- Pothos does not depend on code-generation or experimental decorators for type-safety.
- Pothos has been designed to work at every scale from small prototypes to huge Enterprise applications, and is in use at some of the largest tech companies including Airbnb and Netflix.

## [Plugins that make Pothos even better](https://pothos-graphql.dev/docs#plugins-that-make-pothos-even-better)

[### Add GraphQL Add existing GraphQL types to your schema](https://pothos-graphql.dev/docs/plugins/add-graphql)[### Auth Add global, type level, or field level authorization checks to your schema](https://pothos-graphql.dev/docs/plugins/scope-auth)[### Complexity A plugin for defining and limiting complexity of queries](https://pothos-graphql.dev/docs/plugins/complexity)[### Dataloader Quickly define data-loaders for your types and fields to avoid n+1 queries.](https://pothos-graphql.dev/docs/plugins/dataloader)[### Directives Integrate with existing schema graphql directives in a type-safe way.](https://pothos-graphql.dev/docs/plugins/directives)[### Drizzle A plugin to support efficient queries through drizzles relational query builder API](https://pothos-graphql.dev/docs/plugins/drizzle)[### Errors A plugin for easily including error types in your GraphQL schema and hooking up error types to resolvers.](https://pothos-graphql.dev/docs/plugins/errors)[### Mocks Add mock resolvers for easier testing](https://pothos-graphql.dev/docs/plugins/mocks)[### Prisma A plugin for more efficient integration with prisma that can help solve n+1 issues and more efficiently resolve queries](https://pothos-graphql.dev/docs/plugins/prisma)[### Relay Easy to use builder methods for defining relay style nodes and connections, and helpful utilities for cursor based pagination.](https://pothos-graphql.dev/docs/plugins/relay)[### Simple Objects Define simple object types without resolvers or manual type definitions.](https://pothos-graphql.dev/docs/plugins/simple-objects)[### Smart Subscriptions Make any part of your graph subscribable to get live updates as your data changes.](https://pothos-graphql.dev/docs/plugins/smart-subscriptions)[### Sub-Graph Build multiple subsets of your graph to easily share code between internal and external APIs.](https://pothos-graphql.dev/docs/plugins/sub-graph)[### Tracing Add tracing for resolver execution, with support for opentelemetry, newrelic, century, logging, and custom tracers](https://pothos-graphql.dev/docs/plugins/tracing)[### With-Input Define fields with inline input objects](https://pothos-graphql.dev/docs/plugins/with-input)[### Zod Validation Validating your inputs and arguments](https://pothos-graphql.dev/docs/plugins/zod)

[Sponsors The generous people supporting Pothos development](https://pothos-graphql.dev/docs/sponsors)

### On this page

[Hello, World](https://pothos-graphql.dev/docs#hello-world)[What sets Pothos apart](https://pothos-graphql.dev/docs#what-sets-pothos-apart)[Plugins that make Pothos even better](https://pothos-graphql.dev/docs#plugins-that-make-pothos-even-better)

---

## URL: https://pothos-graphql.dev/docs/sponsors

Title: Sponsors

URL Source: https://pothos-graphql.dev/docs/sponsors

Markdown Content:
Sponsors

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 1: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

# Sponsors

Pothos development supported by [sponsorships](https://github.com/sponsors/hayes) from these generous people and organizations:

- [![Image 3](https://pothos-graphql.dev/assets/the-guild-logo.svg)](https://www.the-guild.dev/)
- [![Image 4](https://pothos-graphql.dev/assets/prisma-logo.svg)](https://www.prisma.io/)
- [![Image 5](https://pothos-graphql.dev/assets/github-logo.svg)](https://pothos-graphql.dev/assets/github-logo.svg)
- ![Image 6](https://pothos-graphql.dev/assets/stellate-logo.svg)
- [@saevarb](https://github.com/saevarb)
- [@seanaye](https://github.com/seanaye)
- [@arimgibson](https://github.com/arimgibson)
- [@ccfiel](https://github.com/ccfiel)
- [@JoviDeCroock](https://github.com/JoviDeCroock)
- [@hellopivot](https://github.com/hellopivot)
- [@robmcguinness](https://github.com/robmcguinness)
- [@Gomah](https://github.com/Gomah)
- [![Image 7](https://pothos-graphql.dev/assets/ips-logo.svg)](https://github.com/IPS-Hosting)
- [@garth](https://github.com/garth)
- [@lifedup](https://github.com/lifedup)
- [@skworden](https://github.com/skworden)
- [@jacobgmathew](https://github.com/jacobgmathew)
- [@aniravi24](https://github.com/aniravi24)
- [@mizdra](https://github.com/mizdra)
- [@3nk1du](https://github.com/3nk1du)
- [@FarazPatankar](https://github.com/FarazPatankar)
- [@noxify](https://github.com/noxify)
- [@matthawk60](https://github.com/matthawk60)
- [@BitPhinix](https://github.com/BitPhinix)
- [@nathanchapman](https://github.com/nathanchapman)
- [@pradyuman](https://github.com/pradyuman)
- [@tmm](https://github.com/tmm)

[Overview Pothos - A plugin based GraphQL schema builder for typescript](https://pothos-graphql.dev/docs)[Resources External guides, tools, and libraries created by members of the Pothos community.](https://pothos-graphql.dev/docs/resources)

---

## URL: https://pothos-graphql.dev/docs/resources

Title: Resources

URL Source: https://pothos-graphql.dev/docs/resources

Markdown Content:
Resources

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 1: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

Resources

# Resources

## [Guides and Tutorials](https://pothos-graphql.dev/docs/resources#guides-and-tutorials)

- [End-To-End Type-Safety with GraphQL, Prisma & React: GraphQL API](https://www.prisma.io/blog/e2e-type-safety-graphql-react-3-fbV2ZVIGWg#start-up-a-graphql-server) by [Sabin Adams](https://twitter.com/sabinthedev)
- [Code-first GraphQL with Pothos](https://graphql.wtf/episodes/60-code-first-graphql-with-pothos) by [Jamie Barton](https://twitter.com/notrab)
- [How to Build a Type-safe GraphQL API using Pothos and Kysely](https://dev.to/franciscomendes10866/how-to-build-a-type-safe-graphql-api-using-pothos-and-kysely-4ja3) by [Francisco Mendes](https://github.com/FranciscoMendes10866)
- [Type-safe GraphQL Server with Pothos](https://omkarkulkarni.hashnode.dev/type-safe-graphql-server-with-pothos-formerly-giraphql) by [Omkar Kulkarni](https://twitter.com/omkar_k45)
- [Build a GraphQL server running on Cloudflare Workers](https://the-guild.dev/blog/graphql-yoga-worker) by [Rito Tamata](https://twitter.com/chimame_rt)

## [3rd party Tools and Libraries](https://pothos-graphql.dev/docs/resources#3rd-party-tools-and-libraries)

- [Prisma Generator Pothos Codegen](https://github.com/Cauen/prisma-generator-pothos-codegen) by [Emanuel](https://twitter.com/cauenor)
- [Nexus to Pothos codemod](https://github.com/villesau/nexus-to-pothos-codemod) by [Ville Saukkonen](https://twitter.com/SaukkonenVille)
- [protoc-gen-pothos](https://github.com/proto-graphql/proto-graphql-js/tree/main/packages/protoc-gen-pothos) by [Masayuki Izumi](https://twitter.com/izumin5210)
- [@smatch-corp/nestjs-pothos](https://github.com/smatch-corp/nestjs-pothos) by [Chanhee Lee](https://github.com/iamchanii)
- [pothos-protoc-gen](https://iamchanii.github.io/pothos-protoc-gen/) by [Chanhee Lee](https://github.com/iamchani)
- [rumble](https://github.com/m1212e/rumble) (GraphQL + Drizzle + Abilities ) by [m1212e](https://github.com/m1212e)[(introduction)](https://github.com/hayes/pothos/discussions/1414)

## [Templates and Examples](https://pothos-graphql.dev/docs/resources#templates-and-examples)

- [Pothos GraphQL Server](https://github.com/theogravity/graphql-pothos-server-example) by [Theo Gravity](https://github.com/theogravity)
- [GraphQL countries server](https://github.com/gbicou/countries-server) by [Benjamin VIELLARD](https://github.com/gbicou)
- [datalake-graphql-wrapper](https://github.com/dbsystel/datalake-graphql-wrapper) by [noxify](https://github.com/noxify)

## [Conference talks](https://pothos-graphql.dev/docs/resources#conference-talks)

- [Pothos + Prisma: delightful, type-safe and efficient GraphQL](https://www.youtube.com/watch?v=LqKPfMmxFxw) by [Michael Hayes](https://twitter.com/yavascript)

## [Paid tools](https://pothos-graphql.dev/docs/resources#paid-tools)

- [Bedrock](https://bedrock.mxstbr.com/) by [Max Stoiber](https://twitter.com/mxstbr)
- [nytro](https://www.nytro.dev/) by [Jordan Gensler](https://twitter.com/vapejuicejordan)

[Sponsors The generous people supporting Pothos development](https://pothos-graphql.dev/docs/sponsors)[Guide Guide for building GraphQL APIs with Pothos](https://pothos-graphql.dev/docs/guide)

### On this page

[Guides and Tutorials](https://pothos-graphql.dev/docs/resources#guides-and-tutorials)[3rd party Tools and Libraries](https://pothos-graphql.dev/docs/resources#3rd-party-tools-and-libraries)[Templates and Examples](https://pothos-graphql.dev/docs/resources#templates-and-examples)[Conference talks](https://pothos-graphql.dev/docs/resources#conference-talks)[Paid tools](https://pothos-graphql.dev/docs/resources#paid-tools)

---

## URL: https://pothos-graphql.dev/docs/guide

Title: Guide

URL Source: https://pothos-graphql.dev/docs/guide

Markdown Content:
Guide

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 1: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Objects](https://pothos-graphql.dev/docs/guide/objects)[Queries, Mutations and Subscriptions](https://pothos-graphql.dev/docs/guide/queries-mutations-and-subscriptions)[SchemaBuilder](https://pothos-graphql.dev/docs/guide/schema-builder)[Fields](https://pothos-graphql.dev/docs/guide/fields)[Using args](https://pothos-graphql.dev/docs/guide/args)[Using Context](https://pothos-graphql.dev/docs/guide/context)[Input Objects](https://pothos-graphql.dev/docs/guide/inputs)[Enums](https://pothos-graphql.dev/docs/guide/enums)[Scalars](https://pothos-graphql.dev/docs/guide/scalars)[Interfaces](https://pothos-graphql.dev/docs/guide/interfaces)[Unions](https://pothos-graphql.dev/docs/guide/unions)[Using plugins](https://pothos-graphql.dev/docs/guide/using-plugins)[Inferring Types](https://pothos-graphql.dev/docs/guide/inferring-types)[File layout](https://pothos-graphql.dev/docs/guide/app-layout)[Generating client types](https://pothos-graphql.dev/docs/guide/generating-client-types)[Patterns](https://pothos-graphql.dev/docs/guide/patterns)[Printing Schemas](https://pothos-graphql.dev/docs/guide/printing-schemas)[Default nullability](https://pothos-graphql.dev/docs/guide/changing-default-nullability)[Writing plugins](https://pothos-graphql.dev/docs/guide/writing-plugins)[Using Deno](https://pothos-graphql.dev/docs/guide/deno)[Circular References](https://pothos-graphql.dev/docs/guide/circular-references)[Troubleshooting](https://pothos-graphql.dev/docs/guide/troubleshooting)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

Guide

# Guide

## [Installing](https://pothos-graphql.dev/docs/guide#installing)

npm pnpm yarn bun

`npm install --save @pothos/core graphql-yoga`

## [Set up typescript](https://pothos-graphql.dev/docs/guide#set-up-typescript)

Pothos is designed to be as type-safe as possible, to ensure everything works correctly, make sure that your `tsconfig.json` has `strict` mode set to true:

```
{
  "compilerOptions": {
    "strict": true
  }
}
```

## [Create a simple schema](https://pothos-graphql.dev/docs/guide#create-a-simple-schema)

```
import SchemaBuilder from '@pothos/core';

const builder = new SchemaBuilder({});

builder.queryType({
  fields: (t) => ({
    hello: t.string({
      args: {
        name: t.arg.string(),
      },
      resolve: (parent, { name }) => `hello, ${name || 'World'}`,
    }),
  }),
});

const schema = builder.toSchema();
```

## [Create a server](https://pothos-graphql.dev/docs/guide#create-a-server)

The schema generated by Pothos is a standard graphql.js schema and can be used with several graphql server implementations including `graphql-yoga`.

```
import { createYoga } from 'graphql-yoga';
import { createServer } from 'node:http';

const yoga = createYoga({
  schema: builder.toSchema(),
});

const server = createServer(yoga);

server.listen(3000);
```

[Resources External guides, tools, and libraries created by members of the Pothos community.](https://pothos-graphql.dev/docs/resources)[Objects Guide for defining Object types in Pothos](https://pothos-graphql.dev/docs/guide/objects)

### On this page

[Installing](https://pothos-graphql.dev/docs/guide#installing)[Set up typescript](https://pothos-graphql.dev/docs/guide#set-up-typescript)[Create a simple schema](https://pothos-graphql.dev/docs/guide#create-a-simple-schema)[Create a server](https://pothos-graphql.dev/docs/guide#create-a-server)

---

## URL: https://pothos-graphql.dev/docs/plugins

Title: Plugins

URL Source: https://pothos-graphql.dev/docs/plugins

Markdown Content:
Plugins

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 1: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Add GraphQL plugin](https://pothos-graphql.dev/docs/plugins/add-graphql)[Complexity plugin](https://pothos-graphql.dev/docs/plugins/complexity)[Dataloader plugin](https://pothos-graphql.dev/docs/plugins/dataloader)[Directive plugin](https://pothos-graphql.dev/docs/plugins/directives)[Drizzle plugin](https://pothos-graphql.dev/docs/plugins/drizzle)[Errors plugin](https://pothos-graphql.dev/docs/plugins/errors)[Federation plugin](https://pothos-graphql.dev/docs/plugins/federation)[Mocks plugin](https://pothos-graphql.dev/docs/plugins/mocks)[Relay plugin](https://pothos-graphql.dev/docs/plugins/relay)[Auth plugin](https://pothos-graphql.dev/docs/plugins/scope-auth)[Simple objects plugin](https://pothos-graphql.dev/docs/plugins/simple-objects)[Smart subscriptions plugin](https://pothos-graphql.dev/docs/plugins/smart-subscriptions)[SubGraph plugin](https://pothos-graphql.dev/docs/plugins/sub-graph)[Tracing plugin](https://pothos-graphql.dev/docs/plugins/tracing)[With-Input plugin](https://pothos-graphql.dev/docs/plugins/with-input)[Zod Validation plugin](https://pothos-graphql.dev/docs/plugins/zod)

[Prisma](https://pothos-graphql.dev/docs/plugins/prisma)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

# Plugins

[### Add GraphQL Add existing GraphQL types to your schema](https://pothos-graphql.dev/docs/plugins/add-graphql)[### Auth Add global, type level, or field level authorization checks to your schema](https://pothos-graphql.dev/docs/plugins/scope-auth)[### Complexity A plugin for defining and limiting complexity of queries](https://pothos-graphql.dev/docs/plugins/complexity)[### Dataloader Quickly define data-loaders for your types and fields to avoid n+1 queries.](https://pothos-graphql.dev/docs/plugins/dataloader)[### Directives Integrate with existing schema graphql directives in a type-safe way.](https://pothos-graphql.dev/docs/plugins/directives)[### Drizzle A plugin to support efficient queries through drizzles relational query builder API](https://pothos-graphql.dev/docs/plugins/drizzle)[### Errors A plugin for easily including error types in your GraphQL schema and hooking up error types to resolvers.](https://pothos-graphql.dev/docs/plugins/errors)[### Mocks Add mock resolvers for easier testing](https://pothos-graphql.dev/docs/plugins/mocks)[### Prisma A plugin for more efficient integration with prisma that can help solve n+1 issues and more efficiently resolve queries](https://pothos-graphql.dev/docs/plugins/prisma)[### Relay Easy to use builder methods for defining relay style nodes and connections, and helpful utilities for cursor based pagination.](https://pothos-graphql.dev/docs/plugins/relay)[### Simple Objects Define simple object types without resolvers or manual type definitions.](https://pothos-graphql.dev/docs/plugins/simple-objects)[### Smart Subscriptions Make any part of your graph subscribable to get live updates as your data changes.](https://pothos-graphql.dev/docs/plugins/smart-subscriptions)[### Sub-Graph Build multiple subsets of your graph to easily share code between internal and external APIs.](https://pothos-graphql.dev/docs/plugins/sub-graph)[### Tracing Add tracing for resolver execution, with support for opentelemetry, newrelic, century, logging, and custom tracers](https://pothos-graphql.dev/docs/plugins/tracing)[### With-Input Define fields with inline input objects](https://pothos-graphql.dev/docs/plugins/with-input)[### Zod Validation Validating your inputs and arguments](https://pothos-graphql.dev/docs/plugins/zod)

[Troubleshooting Guide for troubleshooting common Pothos issues](https://pothos-graphql.dev/docs/guide/troubleshooting)[Add GraphQL plugin A plugin for adding existing GraphQL types to Pothos](https://pothos-graphql.dev/docs/plugins/add-graphql)

---

## URL: https://pothos-graphql.dev/docs/migrations

Title: Migrations

URL Source: https://pothos-graphql.dev/docs/migrations

Markdown Content:

- [3.\* to (4.0)](https://pothos-graphql.dev/docs/migrations/v4)
- [GiraphQL (2.\*) to Pothos (3.0)](https://pothos-graphql.dev/docs/migrations/giraphql-pothos)
- [1.\* to 2.0](https://pothos-graphql.dev/docs/migrations/v2)

## [Migration to Pothos from other GraphQL libraries](https://pothos-graphql.dev/docs/migrations#migration-to-pothos-from-other-graphql-libraries)

Official migration tools are currently a work in progress, and we are hoping to make incremental migration from a number of common setups much easier in the near future. For now there are a few tools that may be helpful while the official tooling for migrations is being developed.

- [Nexus to Pothos codemod](https://github.com/villesau/nexus-to-pothos-codemod)

This 3rd party code-mod aims to transform all the nexus types, queries and mutations to Pothos equivalents. This codemod will still require some manual adjustments to get everything working correctly, but can be a huge help in the migration process.

- [Pothos Generator](https://github.com/hayes/pothos/tree/main/packages/converter)

This is an undocumented CLI that can convert a schema into valid Pothos code. Resolvers are all placeholders that throw errors, so this is not quite as useful as it sounds, but can be helpful, especially for generating input types.

---

## URL: https://pothos-graphql.dev/docs/design

Title: Design

URL Source: https://pothos-graphql.dev/docs/design

Markdown Content:
[Type System](https://pothos-graphql.dev/docs/design#type-system)

---

The type system that powers most of the Pothos type checking has 2 components. The first is the SchemaTypes type param passed into the SchemaBuilder. This allows a shared set of types to be reused throughout the schema, and is responsible for providing type information for shared types like the [Context](https://pothos-graphql.dev/docs/guide/context) object, and any Object, Interface, or Scalar types that you want to reference by name (as a string). Having all type information in a single object can be convenient at times, but with large schemas, can become unwieldy.

To support a number of additional use cases, including Unions and Enums, large schemas, and plugins that use extract type information from other sources (eg the Prisma, or the simple-objects plugin), Pothos has another way of passing around type information. This system is based in `Ref` objects that contain the type information it represents. Every builder method for creating a type or a field returns a `Ref` object.

Using Ref objects allows us to separate the type information from the implementation, and allows for a more modular design.

---

## URL: https://pothos-graphql.dev/docs/#hello-world

Title: Overview

URL Source: https://pothos-graphql.dev/docs/

Markdown Content:
Overview

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 3: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

Overview Hello, World

# Overview

![Image 4: Pothos](https://pothos-graphql.dev/_next/static/media/logo-name-auto.893a025d.svg)

Pothos is a plugin based GraphQL schema builder for typescript.

It makes building graphql schemas in typescript easy, fast and enjoyable. The core of Pothos adds 0 overhead at runtime, and has `graphql` as its only dependency.

Pothos is the most type-safe way to build GraphQL schemas in typescript, and by leveraging type inference and typescript's powerful type system Pothos requires very few manual type definitions and no code generation.

Pothos has a unique and powerful plugin system that makes every plugin feel like its features are built into the core library. Plugins can extend almost any part of the API by adding new options or methods that can take full advantage of the Pothos type system.

## [Hello, World](https://pothos-graphql.dev/docs/#hello-world)

```
import { createYoga } from 'graphql-yoga';
import { createServer } from 'node:http';
import SchemaBuilder from '@pothos/core';

const builder = new SchemaBuilder({});

builder.queryType({
  fields: (t) => ({
    hello: t.string({
      args: {
        name: t.arg.string(),
      },
      resolve: (parent, { name }) => `hello, ${name || 'World'}`,
    }),
  }),
});

const yoga = createYoga({
  schema: builder.toSchema(),
});

const server = createServer(yoga);

server.listen(3000, () => {
  console.log('Visit http://localhost:3000/graphql');
});
```

## [What sets Pothos apart](https://pothos-graphql.dev/docs/#what-sets-pothos-apart)

- Pothos was built from the start to leverage typescript for best-in-class type-safety.
- Pothos has a clear separation between the shape of your external GraphQL API, and the internal representation of your data.
- Pothos comes with a large plugin ecosystem that provides a wide variety of features while maintaining great interoperability between plugins.
- Pothos does not depend on code-generation or experimental decorators for type-safety.
- Pothos has been designed to work at every scale from small prototypes to huge Enterprise applications, and is in use at some of the largest tech companies including Airbnb and Netflix.

## [Plugins that make Pothos even better](https://pothos-graphql.dev/docs/#plugins-that-make-pothos-even-better)

[### Add GraphQL Add existing GraphQL types to your schema](https://pothos-graphql.dev/docs/plugins/add-graphql)[### Auth Add global, type level, or field level authorization checks to your schema](https://pothos-graphql.dev/docs/plugins/scope-auth)[### Complexity A plugin for defining and limiting complexity of queries](https://pothos-graphql.dev/docs/plugins/complexity)[### Dataloader Quickly define data-loaders for your types and fields to avoid n+1 queries.](https://pothos-graphql.dev/docs/plugins/dataloader)[### Directives Integrate with existing schema graphql directives in a type-safe way.](https://pothos-graphql.dev/docs/plugins/directives)[### Drizzle A plugin to support efficient queries through drizzles relational query builder API](https://pothos-graphql.dev/docs/plugins/drizzle)[### Errors A plugin for easily including error types in your GraphQL schema and hooking up error types to resolvers.](https://pothos-graphql.dev/docs/plugins/errors)[### Mocks Add mock resolvers for easier testing](https://pothos-graphql.dev/docs/plugins/mocks)[### Prisma A plugin for more efficient integration with prisma that can help solve n+1 issues and more efficiently resolve queries](https://pothos-graphql.dev/docs/plugins/prisma)[### Relay Easy to use builder methods for defining relay style nodes and connections, and helpful utilities for cursor based pagination.](https://pothos-graphql.dev/docs/plugins/relay)[### Simple Objects Define simple object types without resolvers or manual type definitions.](https://pothos-graphql.dev/docs/plugins/simple-objects)[### Smart Subscriptions Make any part of your graph subscribable to get live updates as your data changes.](https://pothos-graphql.dev/docs/plugins/smart-subscriptions)[### Sub-Graph Build multiple subsets of your graph to easily share code between internal and external APIs.](https://pothos-graphql.dev/docs/plugins/sub-graph)[### Tracing Add tracing for resolver execution, with support for opentelemetry, newrelic, century, logging, and custom tracers](https://pothos-graphql.dev/docs/plugins/tracing)[### With-Input Define fields with inline input objects](https://pothos-graphql.dev/docs/plugins/with-input)[### Zod Validation Validating your inputs and arguments](https://pothos-graphql.dev/docs/plugins/zod)

[Sponsors The generous people supporting Pothos development](https://pothos-graphql.dev/docs/sponsors)

### On this page

[Hello, World](https://pothos-graphql.dev/docs/#hello-world)[What sets Pothos apart](https://pothos-graphql.dev/docs/#what-sets-pothos-apart)[Plugins that make Pothos even better](https://pothos-graphql.dev/docs/#plugins-that-make-pothos-even-better)

---

## URL: https://pothos-graphql.dev/docs/#what-sets-pothos-apart

Title: Overview

URL Source: https://pothos-graphql.dev/docs/

Markdown Content:
Overview

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 3: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

Overview Hello, World

# Overview

![Image 4: Pothos](https://pothos-graphql.dev/_next/static/media/logo-name-auto.893a025d.svg)

Pothos is a plugin based GraphQL schema builder for typescript.

It makes building graphql schemas in typescript easy, fast and enjoyable. The core of Pothos adds 0 overhead at runtime, and has `graphql` as its only dependency.

Pothos is the most type-safe way to build GraphQL schemas in typescript, and by leveraging type inference and typescript's powerful type system Pothos requires very few manual type definitions and no code generation.

Pothos has a unique and powerful plugin system that makes every plugin feel like its features are built into the core library. Plugins can extend almost any part of the API by adding new options or methods that can take full advantage of the Pothos type system.

## [Hello, World](https://pothos-graphql.dev/docs/#hello-world)

```
import { createYoga } from 'graphql-yoga';
import { createServer } from 'node:http';
import SchemaBuilder from '@pothos/core';

const builder = new SchemaBuilder({});

builder.queryType({
  fields: (t) => ({
    hello: t.string({
      args: {
        name: t.arg.string(),
      },
      resolve: (parent, { name }) => `hello, ${name || 'World'}`,
    }),
  }),
});

const yoga = createYoga({
  schema: builder.toSchema(),
});

const server = createServer(yoga);

server.listen(3000, () => {
  console.log('Visit http://localhost:3000/graphql');
});
```

## [What sets Pothos apart](https://pothos-graphql.dev/docs/#what-sets-pothos-apart)

- Pothos was built from the start to leverage typescript for best-in-class type-safety.
- Pothos has a clear separation between the shape of your external GraphQL API, and the internal representation of your data.
- Pothos comes with a large plugin ecosystem that provides a wide variety of features while maintaining great interoperability between plugins.
- Pothos does not depend on code-generation or experimental decorators for type-safety.
- Pothos has been designed to work at every scale from small prototypes to huge Enterprise applications, and is in use at some of the largest tech companies including Airbnb and Netflix.

## [Plugins that make Pothos even better](https://pothos-graphql.dev/docs/#plugins-that-make-pothos-even-better)

[### Add GraphQL Add existing GraphQL types to your schema](https://pothos-graphql.dev/docs/plugins/add-graphql)[### Auth Add global, type level, or field level authorization checks to your schema](https://pothos-graphql.dev/docs/plugins/scope-auth)[### Complexity A plugin for defining and limiting complexity of queries](https://pothos-graphql.dev/docs/plugins/complexity)[### Dataloader Quickly define data-loaders for your types and fields to avoid n+1 queries.](https://pothos-graphql.dev/docs/plugins/dataloader)[### Directives Integrate with existing schema graphql directives in a type-safe way.](https://pothos-graphql.dev/docs/plugins/directives)[### Drizzle A plugin to support efficient queries through drizzles relational query builder API](https://pothos-graphql.dev/docs/plugins/drizzle)[### Errors A plugin for easily including error types in your GraphQL schema and hooking up error types to resolvers.](https://pothos-graphql.dev/docs/plugins/errors)[### Mocks Add mock resolvers for easier testing](https://pothos-graphql.dev/docs/plugins/mocks)[### Prisma A plugin for more efficient integration with prisma that can help solve n+1 issues and more efficiently resolve queries](https://pothos-graphql.dev/docs/plugins/prisma)[### Relay Easy to use builder methods for defining relay style nodes and connections, and helpful utilities for cursor based pagination.](https://pothos-graphql.dev/docs/plugins/relay)[### Simple Objects Define simple object types without resolvers or manual type definitions.](https://pothos-graphql.dev/docs/plugins/simple-objects)[### Smart Subscriptions Make any part of your graph subscribable to get live updates as your data changes.](https://pothos-graphql.dev/docs/plugins/smart-subscriptions)[### Sub-Graph Build multiple subsets of your graph to easily share code between internal and external APIs.](https://pothos-graphql.dev/docs/plugins/sub-graph)[### Tracing Add tracing for resolver execution, with support for opentelemetry, newrelic, century, logging, and custom tracers](https://pothos-graphql.dev/docs/plugins/tracing)[### With-Input Define fields with inline input objects](https://pothos-graphql.dev/docs/plugins/with-input)[### Zod Validation Validating your inputs and arguments](https://pothos-graphql.dev/docs/plugins/zod)

[Sponsors The generous people supporting Pothos development](https://pothos-graphql.dev/docs/sponsors)

### On this page

[Hello, World](https://pothos-graphql.dev/docs/#hello-world)[What sets Pothos apart](https://pothos-graphql.dev/docs/#what-sets-pothos-apart)[Plugins that make Pothos even better](https://pothos-graphql.dev/docs/#plugins-that-make-pothos-even-better)

---

## URL: https://pothos-graphql.dev/docs/#plugins-that-make-pothos-even-better

Title: Overview

URL Source: https://pothos-graphql.dev/docs/

Markdown Content:
Overview

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 3: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

Overview Hello, World

# Overview

![Image 4: Pothos](https://pothos-graphql.dev/_next/static/media/logo-name-auto.893a025d.svg)

Pothos is a plugin based GraphQL schema builder for typescript.

It makes building graphql schemas in typescript easy, fast and enjoyable. The core of Pothos adds 0 overhead at runtime, and has `graphql` as its only dependency.

Pothos is the most type-safe way to build GraphQL schemas in typescript, and by leveraging type inference and typescript's powerful type system Pothos requires very few manual type definitions and no code generation.

Pothos has a unique and powerful plugin system that makes every plugin feel like its features are built into the core library. Plugins can extend almost any part of the API by adding new options or methods that can take full advantage of the Pothos type system.

## [Hello, World](https://pothos-graphql.dev/docs/#hello-world)

```
import { createYoga } from 'graphql-yoga';
import { createServer } from 'node:http';
import SchemaBuilder from '@pothos/core';

const builder = new SchemaBuilder({});

builder.queryType({
  fields: (t) => ({
    hello: t.string({
      args: {
        name: t.arg.string(),
      },
      resolve: (parent, { name }) => `hello, ${name || 'World'}`,
    }),
  }),
});

const yoga = createYoga({
  schema: builder.toSchema(),
});

const server = createServer(yoga);

server.listen(3000, () => {
  console.log('Visit http://localhost:3000/graphql');
});
```

## [What sets Pothos apart](https://pothos-graphql.dev/docs/#what-sets-pothos-apart)

- Pothos was built from the start to leverage typescript for best-in-class type-safety.
- Pothos has a clear separation between the shape of your external GraphQL API, and the internal representation of your data.
- Pothos comes with a large plugin ecosystem that provides a wide variety of features while maintaining great interoperability between plugins.
- Pothos does not depend on code-generation or experimental decorators for type-safety.
- Pothos has been designed to work at every scale from small prototypes to huge Enterprise applications, and is in use at some of the largest tech companies including Airbnb and Netflix.

## [Plugins that make Pothos even better](https://pothos-graphql.dev/docs/#plugins-that-make-pothos-even-better)

[### Add GraphQL Add existing GraphQL types to your schema](https://pothos-graphql.dev/docs/plugins/add-graphql)[### Auth Add global, type level, or field level authorization checks to your schema](https://pothos-graphql.dev/docs/plugins/scope-auth)[### Complexity A plugin for defining and limiting complexity of queries](https://pothos-graphql.dev/docs/plugins/complexity)[### Dataloader Quickly define data-loaders for your types and fields to avoid n+1 queries.](https://pothos-graphql.dev/docs/plugins/dataloader)[### Directives Integrate with existing schema graphql directives in a type-safe way.](https://pothos-graphql.dev/docs/plugins/directives)[### Drizzle A plugin to support efficient queries through drizzles relational query builder API](https://pothos-graphql.dev/docs/plugins/drizzle)[### Errors A plugin for easily including error types in your GraphQL schema and hooking up error types to resolvers.](https://pothos-graphql.dev/docs/plugins/errors)[### Mocks Add mock resolvers for easier testing](https://pothos-graphql.dev/docs/plugins/mocks)[### Prisma A plugin for more efficient integration with prisma that can help solve n+1 issues and more efficiently resolve queries](https://pothos-graphql.dev/docs/plugins/prisma)[### Relay Easy to use builder methods for defining relay style nodes and connections, and helpful utilities for cursor based pagination.](https://pothos-graphql.dev/docs/plugins/relay)[### Simple Objects Define simple object types without resolvers or manual type definitions.](https://pothos-graphql.dev/docs/plugins/simple-objects)[### Smart Subscriptions Make any part of your graph subscribable to get live updates as your data changes.](https://pothos-graphql.dev/docs/plugins/smart-subscriptions)[### Sub-Graph Build multiple subsets of your graph to easily share code between internal and external APIs.](https://pothos-graphql.dev/docs/plugins/sub-graph)[### Tracing Add tracing for resolver execution, with support for opentelemetry, newrelic, century, logging, and custom tracers](https://pothos-graphql.dev/docs/plugins/tracing)[### With-Input Define fields with inline input objects](https://pothos-graphql.dev/docs/plugins/with-input)[### Zod Validation Validating your inputs and arguments](https://pothos-graphql.dev/docs/plugins/zod)

[Sponsors The generous people supporting Pothos development](https://pothos-graphql.dev/docs/sponsors)

### On this page

[Hello, World](https://pothos-graphql.dev/docs/#hello-world)[What sets Pothos apart](https://pothos-graphql.dev/docs/#what-sets-pothos-apart)[Plugins that make Pothos even better](https://pothos-graphql.dev/docs/#plugins-that-make-pothos-even-better)

---

## URL: https://pothos-graphql.dev/docs/plugins/add-graphql

Title: Add GraphQL plugin

URL Source: https://pothos-graphql.dev/docs/plugins/add-graphql

Markdown Content:
Add GraphQL plugin

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 1: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Add GraphQL plugin](https://pothos-graphql.dev/docs/plugins/add-graphql)[Complexity plugin](https://pothos-graphql.dev/docs/plugins/complexity)[Dataloader plugin](https://pothos-graphql.dev/docs/plugins/dataloader)[Directive plugin](https://pothos-graphql.dev/docs/plugins/directives)[Drizzle plugin](https://pothos-graphql.dev/docs/plugins/drizzle)[Errors plugin](https://pothos-graphql.dev/docs/plugins/errors)[Federation plugin](https://pothos-graphql.dev/docs/plugins/federation)[Mocks plugin](https://pothos-graphql.dev/docs/plugins/mocks)[Relay plugin](https://pothos-graphql.dev/docs/plugins/relay)[Auth plugin](https://pothos-graphql.dev/docs/plugins/scope-auth)[Simple objects plugin](https://pothos-graphql.dev/docs/plugins/simple-objects)[Smart subscriptions plugin](https://pothos-graphql.dev/docs/plugins/smart-subscriptions)[SubGraph plugin](https://pothos-graphql.dev/docs/plugins/sub-graph)[Tracing plugin](https://pothos-graphql.dev/docs/plugins/tracing)[With-Input plugin](https://pothos-graphql.dev/docs/plugins/with-input)[Zod Validation plugin](https://pothos-graphql.dev/docs/plugins/zod)

[Prisma](https://pothos-graphql.dev/docs/plugins/prisma)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

Add GraphQL plugin Install

[Plugins](https://pothos-graphql.dev/docs/plugins)

# Add GraphQL plugin

This plugin makes it easy to integrate GraphQL types from existing schemas into your Pothos API

It can be used for incremental migrations from nexus, graphql-tools, or any other JS/TS executable schema.

## [Install](https://pothos-graphql.dev/docs/plugins/add-graphql#install)

npm pnpm yarn bun

`npm install --save @pothos/plugin-add-graphql`

## [Setup](https://pothos-graphql.dev/docs/plugins/add-graphql#setup)

```
import AddGraphQLPlugin from '@pothos/plugin-add-graphql';

const builder = new SchemaBuilder({
  plugins: [AddGraphQLPlugin],
});
```

## [Usage](https://pothos-graphql.dev/docs/plugins/add-graphql#usage)

There are 2 ways you can reference existing types.

- Adding types (or a whole external schema) when setting up the builder
- Adding types as Refs using new builder methods

### [Adding types when creating your builder](https://pothos-graphql.dev/docs/plugins/add-graphql#adding-types-when-creating-your-builder)

Adding types to the builder will automatically include the types in your schema when it's built. Types will only be added if no existing type of the same name is added to the builder before building the schema.

Adding types recursively adds any other types that the added type depends in it's fields, interfaces, or union members.

```
import { existingSchema } from './existing-schema-location';

const builder = new SchemaBuilder({
  plugins: [AddGraphQLPlugin],
  add: {
    // You can add individual types
    // This accepts Any GraphQLNamedType (Objects, Interface, Unions, Enums, Scalars, and InputObjects)
    types: [existingSchema.getType('User'), existingSchema.getType('Post')],
    // Or you can add an entire external schema
    schema: existingSchema,
  },
});
```

Adding types by themselves isn't very useful, so you'll probably want to be able to reference them when defining fields in your schema. To do this, you can add them to the builders generic Types.

This currently only works for `Object`, `Interface`, and `Scalar` types. For other types, use the builder methods below to create refs to the added types.

```
import { existingSchema } from './existing-schema-location';

const builder = new SchemaBuilder<{
  Objects: {
    User: UserType;
  };
  Interfaces: {
    ExampleInterface: { id: string };
  };
  Scalars: {
    DateTime: {
      Output: Date;
      Input: Date;
    };
  };
}>({
  plugins: [AddGraphQLPlugin],
  add: {
    types: [
      existingSchema.getType('User'),
      existingSchema.getType('ExampleInterface'),
      existingSchema.getType('DateTime'),
    ],
  },
});

builder.queryFields((t) => ({
  user: t.field({ type: 'User', resolve: () => getUser() }),
  exampleInterface: t.field({ type: 'ExampleInterface', resolve: () => getThings() }),
  now: t.field({ type: 'DateTime', resolve: () => new Date() }),
}));
```

### [Adding types using builder methods](https://pothos-graphql.dev/docs/plugins/add-graphql#adding-types-using-builder-methods)

#### [Objects](https://pothos-graphql.dev/docs/plugins/add-graphql#objects)

```
// Passing in a generic type is recommended to ensure type-safety
const UserRef = builder.addGraphQLObject<UserType>(
  existingSchema.getType('User') as GraphQLObjectType,
  {
    // Optionally you can override the types name
    name: 'AddedUser',
    // You can also pass in any other options you can define for normal object types
    description: 'This type represents Users',
  },
);

const PostRef = builder.addGraphQLObject<{
  id: string;
  title: string;
  content: string;
}>(existingSchema.getType('Post') as GraphQLObjectType, {
  fields: (t) => ({
    // remove existing title field from type
    title: null,
    // add new titleField
    postTitle: t.exposeString('title'),
  }),
});
```

You can then use the returned references when defining fields:

```
builder.queryFields((t) => ({
  posts: t.field({
    type: [PostRef],
    resolve: () => loadPosts(),
  }),
}));
```

### [Interfaces](https://pothos-graphql.dev/docs/plugins/add-graphql#interfaces)

```
const NodeRef = builder.addGraphQLInterface<NodeShape>(
  existingSchema.getType('Node') as GraphQLInterfaceType,
  {
    // interface options
  },
);
```

### [Unions](https://pothos-graphql.dev/docs/plugins/add-graphql#unions)

```
const SearchResult = builder.addGraphQLUnion<User | Post>(
  existingSchema.getType('SearchResult') as GraphQLUnionType,
  {
    // union options
  },
);
```

### [Enums](https://pothos-graphql.dev/docs/plugins/add-graphql#enums)

```
const OrderBy = builder.addGraphQLEnum<'Asc' | 'Desc'>(
  existingSchema.getType('OrderBy') as GraphQLEnumType,
  {
    // enum options
  },
);
```

### [Input objects](https://pothos-graphql.dev/docs/plugins/add-graphql#input-objects)

```
const PostFilter = builder.addGraphQLInput<{ title?: string, tags? string[] }>(
  existingSchema.getType('PostFilter') as GraphQLInputObjectType,
  {
    // input options
  },
);
```

### [Scalars](https://pothos-graphql.dev/docs/plugins/add-graphql#scalars)

This plugin does not add a new method for scalars, because Pothos already has a method for adding existing scalar types.

```
builder.addScalarType('DateTime', existingSchema.getType('DateTime') as GraphQLScalar, {
  // scalar options
});
```

[Plugins List of plugins for Pothos](https://pothos-graphql.dev/docs/plugins)[Complexity plugin Complexity plugin docs for Pothos](https://pothos-graphql.dev/docs/plugins/complexity)

### On this page

[Install](https://pothos-graphql.dev/docs/plugins/add-graphql#install)[Setup](https://pothos-graphql.dev/docs/plugins/add-graphql#setup)[Usage](https://pothos-graphql.dev/docs/plugins/add-graphql#usage)[Adding types when creating your builder](https://pothos-graphql.dev/docs/plugins/add-graphql#adding-types-when-creating-your-builder)[Adding types using builder methods](https://pothos-graphql.dev/docs/plugins/add-graphql#adding-types-using-builder-methods)[Objects](https://pothos-graphql.dev/docs/plugins/add-graphql#objects)[Interfaces](https://pothos-graphql.dev/docs/plugins/add-graphql#interfaces)[Unions](https://pothos-graphql.dev/docs/plugins/add-graphql#unions)[Enums](https://pothos-graphql.dev/docs/plugins/add-graphql#enums)[Input objects](https://pothos-graphql.dev/docs/plugins/add-graphql#input-objects)[Scalars](https://pothos-graphql.dev/docs/plugins/add-graphql#scalars)

---

## URL: https://pothos-graphql.dev/docs/plugins/scope-auth

Title: Auth plugin

URL Source: https://pothos-graphql.dev/docs/plugins/scope-auth

Markdown Content:
The scope auth plugin aims to be a general purpose authorization plugin that can handle a wide variety of authorization use cases, while incurring a minimal performance overhead.

### [Install](https://pothos-graphql.dev/docs/plugins/scope-auth#install)

#### [IMPORTANT](https://pothos-graphql.dev/docs/plugins/scope-auth#important)

When using `scope-auth` with other plugins, the `scope-auth` plugin should generally be listed first to ensure that other plugins that wrap resolvers do not execute before the `scope-auth` logic. However, exceptions do exist where it is desirable for a plugin to run before `scope-auth`. For instance, putting the [relay plugin](https://pothos-graphql.dev/docs/plugins/relay) before the `scope-auth` plugin results in the `authScopes` function correctly receiving parsed `globalID`s.

### [Setup](https://pothos-graphql.dev/docs/plugins/scope-auth#setup)

In the above setup, We import the `scope-auth` plugin, and include it in the builders plugin list. We also define 2 important things:

1.  The `AuthScopes` type in the builder `SchemaTypes`. This is a map of types that defines the types used by each of your scopes. We'll see how this is used in more detail below.

2.  The `scope initializer` function, which is the implementation of each of the scopes defined in the type above. This function returns a map of either booleans (indicating if the request has the scope) or functions that load the scope (with an optional parameter).

The names of the scopes (`public`, `employee`, `deferredScope`, and `customPerm`) are all arbitrary, and are not part of the plugin. You can use whatever scope names you prefer, and can add as many you need.

### [Using a scope on a field](https://pothos-graphql.dev/docs/plugins/scope-auth#using-a-scope-on-a-field)

A lot of terms around authorization are overloaded, and can mean different things to different people. Here is a short list of a few terms used in this document, and how they should be interpreted:

- `scope`: A scope is the unit of authorization that can be used to authorize a request to resolve a field.

- `scope map`: A map of scope names and scope parameters. This defines the set of scopes that will be checked for a field or type to authorize the request the resolve a resource.

- `scope loader`: A function for dynamically loading scope given a scope parameter. Scope loaders are ideal for integrating with a permission service, or creating scopes that can be customized based on the field or values that they are authorizing.

- `scope parameter`: A parameter that will be passed to a scope loader. These are the values in the authScopes objects.

- `scope initializer`: The function that creates the scopes or scope loaders for the current request.

While this plugin uses `scopes` as the term for its authorization mechanism, this plugin can easily be used for role or permission based schemes, and is not intended to dictate a specific philosophy around how to authorize requests/access to resources.

Examples below assume the following builder setup:

### [Top level auth on queries and mutations](https://pothos-graphql.dev/docs/plugins/scope-auth#top-level-auth-on-queries-and-mutations)

To add an auth check to root level queries or mutations, add authScopes to the field options:

This will require the requests to have the `employee` scope. Adding multiple scopes to the `authScopes` object will check all the scopes, and if the user has any of the scopes, the request will be considered authorized for the current field. Subscription and Mutation root fields work the same way.

### [Auth on nested fields](https://pothos-graphql.dev/docs/plugins/scope-auth#auth-on-nested-fields)

Fields on nested objects can be authorized the same way scopes are authorized on the root types.

### [Default auth for all fields on types](https://pothos-graphql.dev/docs/plugins/scope-auth#default-auth-for-all-fields-on-types)

To apply the same scope requirements to all fields on a type, you can define an `authScope` map in the type options rather than on the individual fields.

### [Overwriting default auth on field](https://pothos-graphql.dev/docs/plugins/scope-auth#overwriting-default-auth-on-field)

In some cases you may want to use default auth scopes for a type, but need to change the behavior for one specific field.

To add additional requirements for a specific field you can simply add additional scopes on the field itself.

To remove the type level scopes for a field, you can use the `skipTypeScopes` option:

This will allow non-logged in users to resolve the title, but not the content of an Article. `skipTypeScopes` can be used in conjunction with `authScopes` on a field to completely overwrite the default scopes.

### [Running scopes on types rather than fields](https://pothos-graphql.dev/docs/plugins/scope-auth#running-scopes-on-types-rather-than-fields)

By default, all auth scopes are tested before a field resolves. This includes both scopes defined on a type and scopes defined on a field. When scopes for a `type` fail, you will end up with an error for each field of that type. Type level scopes are only executed once, but the errors are emitted for each affected field.

The behavior may not be desirable for all users. You can set `runScopesOnType` to true, either on object types, or in the `scopeAuth` options of the builder

Enabling this has a couple of limitations:

1.  THIS DOES NOT CURRENTLY WORK WITH `graphql-jit`. This option uses the `isTypeOf` function, but `graphql-jit` does not support async `isTypeOf`, and also does not correctly pass the context object to the isTypeOf checks. Until this is resolved, this option will not work with `graphql-jit`.

2.  Fields of types that set `runScopesOnType` to true will not be able to use `skipTypeScopes` or `skipInterfaceScopes`.

### [Generalized auth functions with field specific arguments](https://pothos-graphql.dev/docs/plugins/scope-auth#generalized-auth-functions-with-field-specific-arguments)

The scopes we have covered so far have all been related to information that applies to a full request. In more complex applications you may not make sense to enumerate all the scopes a request is authorized for ahead of time. To handle these cases you can define a scope loader which takes a parameter and dynamically determines if a request is authorized for a scope using that parameter.

One common example of this would be a permission service that can check if a user or request has a certain permission, and you want to specify the specific permission each field requires.

In the example above, the authScope map uses the customPerm scope loader with a parameter of `readArticle`. The first time a field requests this scope, the customPerm loader will be called with `readArticle` as its argument. This scope will be cached, so that if multiple fields request the same scope, the scope loader will still only be called once.

The types for the parameters you provide for each scope are based on the types provided to the builder in the `AuthScopes` type.

### [Customizing error messages](https://pothos-graphql.dev/docs/plugins/scope-auth#customizing-error-messages)

Error messages (and error instances) can be customized either globally or on specific fields.

#### [Globally](https://pothos-graphql.dev/docs/plugins/scope-auth#globally)

The `unauthorizedError` callback will be called with the parent, context, and info object of the unauthorized field. It will also include a 4th argument `result` that has the default message for this type of failure, and a `failure` property with some details about what caused the field to be unauthorized. This callback can either return an `Error` instance (or an instance of a class that extends `Error`), or a `string`. If a string is returned, it will be converted to a `ForbiddenError`.

The `treatErrorsAsUnauthorized` option changes how errors in authorization functions are handled. By default errors are not caught by the plugin, and will act as if thrown directly from the resolver. This means that thrown errors bypass the `unauthorizedError` callback, and will cause requests to fail even when another scope in an `$any` passes.

Setting `treatErrorsAsUnauthorized` will cause errors to be caught and treated as if the scope was not authorized.

When `treatErrorsAsUnauthorized` is set to true, errors are caught and attached to the `result` object in the `unauthorizedError` callback. This allows you to surface the error to the client.

For example, if you want to re-throw errors thrown by authorization functions you could do this by writing a custom `unauthorizedError` callback like this:

#### [On individual fields](https://pothos-graphql.dev/docs/plugins/scope-auth#on-individual-fields)

### [Returning a custom value when unauthorized](https://pothos-graphql.dev/docs/plugins/scope-auth#returning-a-custom-value-when-unauthorized)

In some cases you may want to return null, and empty array, throw a custom error, or return a custom result when a user is not authorized. To do this you can add a `unauthorizedResolver` option to your field.

In the example above, if a user is not authorized they will simply receive an empty array in the response. The `unauthorizedResolver` option takes the same arguments as a resolver, but also receives a 5th argument that is an instance of `ForbiddenError`.

### [Setting scopes that apply for a full request](https://pothos-graphql.dev/docs/plugins/scope-auth#setting-scopes-that-apply-for-a-full-request)

We have already seen several examples of this. For scopes that apply to a full request like `public` or `employee`, rather than using a scope loader, the scope initializer can simply use a boolean to indicate if the request has the given scope. If you know ahead of time that a scope loader will always return false for a specific request, you can do something like the following to avoid the additional overhead of running the loader:

This will ensure that if a request accesses a field that requests a `humanPermission` scope, and the request is made by another service or bot, we don't have to run the `hasPermission` check at all for those requests, since we know it would return false anyways.

### [Change context types based on scopes](https://pothos-graphql.dev/docs/plugins/scope-auth#change-context-types-based-on-scopes)

Sometimes you need to change your context typings depending on the applied scopes. You can provide custom context for your defined scopes and use the `authField` method to access the custom context:

Some plugins contribute field builder methods with additional functionality that may not work with `t.authField`. In order to work with those methods, there is also a `t.withAuth` method that can be used to return a field builder with authScopes predefined.

### [Logical operations on auth scopes (any/all)](https://pothos-graphql.dev/docs/plugins/scope-auth#logical-operations-on-auth-scopes-anyall)

By default the scopes in a scope map are evaluated in parallel, and if the request has any of the requested scopes, the field will be resolved. In some cases, you may want to require multiple scopes:

You can use the built in `$any` and `$all` scope loaders to combine requirements for scopes. The above example requires a request to have either the `employee` or `deferredScope` scopes, and the `public` scope. `$any` and `$all` each take a scope map as their parameters, and can be nested inside each other.

You can change the default strategy used for top level auth scopes by setting the `defaultStrategy` option in the builder (defaults to `any`):

### [Auth that depends on parent value](https://pothos-graphql.dev/docs/plugins/scope-auth#auth-that-depends-on-parent-value)

For cases where the required scopes depend on the value of the requested resource you can use a function in the `authScopes` option that returns the scope map for the field.

authScope functions on fields will receive the same arguments as the field resolver, and will be called each time the resolve for the field would be called. This means the same authScope function could be called multiple time for the same resource if the field is requested multiple times using an alias.

Returning a boolean from an auth scope function is an easy way to allow or disallow a request from resolving a field without needing to evaluate additional scopes.

### [Setting type level scopes based on the parent value](https://pothos-graphql.dev/docs/plugins/scope-auth#setting-type-level-scopes-based-on-the-parent-value)

You can also use a function in the authScope option for types. This function will be invoked with the parent and the context as its arguments, and should return a scope map.

The above example uses an authScope function to prevent the fields of an article from being loaded by non employees unless they have been published.

### [Setting scopes based on the return value of a field](https://pothos-graphql.dev/docs/plugins/scope-auth#setting-scopes-based-on-the-return-value-of-a-field)

This is a use that is not currently supported. The current work around is to move those checks down to the returned type. Combining this with `runScopesOnType` should work for most cases.

### [Granting access to a resource based on how it is accessed](https://pothos-graphql.dev/docs/plugins/scope-auth#granting-access-to-a-resource-based-on-how-it-is-accessed)

In some cases, you may want to grant a request scopes to access certain fields on a child type. To do this you can use `$granted` scopes.

In the above example, the fields of the `Article` type normally require the `public` scope granted to logged in users, but can also be accessed with the `$granted` scope `readArticle`. This means that if the field that returned the Article "granted" the scope, the article can be read. The `freeArticle` field on the `Query` type grants this scope, allowing anyone querying that field to access fields of the free article. `$granted` scopes are separate from other scopes, and do not give a request access to normal scopes of the same name. `$granted` scopes are also not inherited by nested children, and would need to be explicitly passed down for each field if you wanted to grant access to nested children.

### [Reusing checks for multiple, but not all fields](https://pothos-graphql.dev/docs/plugins/scope-auth#reusing-checks-for-multiple-but-not-all-fields)

You may have cases where groups of fields on a type are accessible using some shared condition. This is another case where `$granted` scopes can be helpful.

In the above example, `title`, `content`, and `viewCount` each use `$granted` scopes. In this case, rather than scopes being granted by the parent field, they are granted by the Article type itself. This allows the access to each field to change based on some dynamic conditions (if the request is from the author, and if the article is a draft) without having to duplicate that logic in each individual field.

### [Interfaces](https://pothos-graphql.dev/docs/plugins/scope-auth#interfaces)

Interfaces can define auth scopes on their fields the same way objects do. Fields for a type will run checks for each interface it implements separately, meaning that a request would need to satisfy the scope requirements for each interface separately before the field is resolved.

Object types can set `skipInterfaceScopes` to `true` to skip interface checks when resolving fields for that Object type.

### [Cache keys](https://pothos-graphql.dev/docs/plugins/scope-auth#cache-keys)

Auth scopes by default are cached based on the identity of the scope parameter. This works great for statically defined scopes, and scopes that take primitive values as their parameters. If you define auth scopes that take complex objects, and create those objects in a scope function (based on arguments, or parent values) You won't get cache hits on those checks.

To work around this, you can provide a `cacheKey` option to the builder for generating a cache key from your scope checks.

Above we are using `JSON.stringify` to generate a key. This will work for most complex objects, but you may want to consider something like `faster-stable-stringify` that can handle circular references, and swill always produce the same output regardless of the order of properties.

### [Scope Initializer](https://pothos-graphql.dev/docs/plugins/scope-auth#scope-initializer)

The scope initializer would be run once the first time a field protected by auth scopes is resolved, its result will be cached for the current request.

### [authScopes functions on fields](https://pothos-graphql.dev/docs/plugins/scope-auth#authscopes-functions-on-fields)

When using a function for `authScopes` on a field, the function will be run each time the field is resolved, since it has access to all the arguments passed to the resolver

### [authScopes functions on types](https://pothos-graphql.dev/docs/plugins/scope-auth#authscopes-functions-on-types)

When using a function for `authScopes` on a type, the function will be run the once for each instance of that type in the response. It will be run lazily when the first field for that object is resolved, and its result will be cached and reused by all fields for that instance of the type.

### [scope loaders](https://pothos-graphql.dev/docs/plugins/scope-auth#scope-loaders)

Scope loaders will be run run whenever a field requires the corresponding scope with a unique parameter. The scope loader results are cached per request based on a combination of the name of the scope, and its parameter.

### [grantScope on field](https://pothos-graphql.dev/docs/plugins/scope-auth#grantscope-on-field)

`grantScopes` on a field will run after the field is resolved, and is not cached

### [grantScope on type](https://pothos-graphql.dev/docs/plugins/scope-auth#grantscope-on-type)

`grantScopes` on a type (object or interface) will run when the first field on the type is resolved. It's result will be cached and reused for each field of the same instance of the type.

### [Types](https://pothos-graphql.dev/docs/plugins/scope-auth#types)

- `AuthScopes`: `extends {}`. Each property is the name of its scope, each value is the type for the scopes parameter.

- `ScopeLoaderMap`: Object who's keys are scope names (from `AuthScopes`) and whos values are either booleans (indicating whether or not the request has the scope) or function that take a parameter (type from `AuthScope`) and return `MaybePromise<boolean>`

- `ScopeMap`: A map of scope names to parameters. Based on `AuthScopes`, may also contain `$all`, `$any` or `$granted`.

### [Builder](https://pothos-graphql.dev/docs/plugins/scope-auth#builder)

- `authScopes`: (context: Types['Context']) =>`MaybePromise<ScopeLoaderMap<Types>>`

### [Object and Interface options](https://pothos-graphql.dev/docs/plugins/scope-auth#object-and-interface-options)

- `authScopes`: `ScopeMap` or `function`, accepts `parent` and `context` returns `MaybePromise<ScopeMap>`

- `grantScopes`: `function`, accepts `parent` and `context` returns `MaybePromise<string[]>`

### [Field Options](https://pothos-graphql.dev/docs/plugins/scope-auth#field-options)

- `authScopes`: `ScopeMap` or `function`, accepts same arguments as resolver, returns `MaybePromise<ScopeMap>`

- `grantScopes`: `string[]` or `function`, accepts same arguments as resolver, returns `MaybePromise<string[]>`

- `skipTypeScopes`: `boolean`

- `skipInterfaceScopes`: `boolean`

### [toSchema options](https://pothos-graphql.dev/docs/plugins/scope-auth#toschema-options)

- `disableScopeAuth`: disable the scope auth plugin. Useful for testing.

---

## URL: https://pothos-graphql.dev/docs/plugins/complexity

Title: Complexity plugin

URL Source: https://pothos-graphql.dev/docs/plugins/complexity

Markdown Content:
This plugin allows you to define complexity of fields and limit the maximum complexity, depth, and breadth of queries.

### [Install](https://pothos-graphql.dev/docs/plugins/complexity#install)

### [Setup](https://pothos-graphql.dev/docs/plugins/complexity#setup)

### [Configure defaults and limits](https://pothos-graphql.dev/docs/plugins/complexity#configure-defaults-and-limits)

To limit query complexity you can specify a maximum complexity either in the builder setup, or when building the schema:

#### [Options](https://pothos-graphql.dev/docs/plugins/complexity#options)

- fieldComplexity: (optional, `(args, ctx, field) => { complexity: number, multiplier: number} | number`): default complexity calculation for fields. `defaultComplexity` and `defaultListMultiplier` will not be used if this is set.
- defaultComplexity: (optional `number`) defines the default complexity for every field in the schema
- defaultListMultiplier: (optional `number`) defines a default complexity multiplier for a list fields sub selections
- limit: Defines limits for queries, passed the context object if `limit` is a function

  - complexity: defines the maximum complexity allowed for queries
  - depth: defines the maximum depth of selections in a query
  - breadth: defines the maximum total selections in a query

- complexityError: (optional `function`) defines the error to throw when the query complexity exceeds the limit. The function is passed the errorKind (depth, breadth, or complexity), the result (with the depth, breadth, complext, and max values), and a GraphQL `info` object. It should return (or throw) an error, or a an error message as a string

### [How complexity is calculated](https://pothos-graphql.dev/docs/plugins/complexity#how-complexity-is-calculated)

Complexity is calculated before resolving root any root level fields (query, mutation, subscription), and is based purely on the shape of the query before execution begins.

The complexity of a query is the sum of the complexity of each selected field. If a field has sub-selections, the complexity of its sub-selections are multiplied by a fields multiplier, and then added to the fields own complexity. The default multiplier for fields is 1, and 10 for list fields. This multiplier is meant to the n+1 complexity of list fields.

#### [Example](https://pothos-graphql.dev/docs/plugins/complexity#example)

The following query has a complexity of `131` (assuming we are using the default options), a depth of `3`, and a breadth of `5`:

### [Defining complexity of a field:](https://pothos-graphql.dev/docs/plugins/complexity#defining-complexity-of-a-field)

You can set a custom complexity value on any field:

The complexity option can also set the multiplier for a field:

A fields complexity can also be based on the fields arguments, or the context value:

### [`complexityFromQuery(query, options)`](https://pothos-graphql.dev/docs/plugins/complexity#complexityfromqueryquery-options)

Returns the query complexity for a given GraphQL query.

---

## URL: https://pothos-graphql.dev/docs/plugins/dataloader

Title: Dataloader plugin

URL Source: https://pothos-graphql.dev/docs/plugins/dataloader

Markdown Content:
This plugin makes it easy to add fields and types that are loaded through a dataloader.

### [Install](https://pothos-graphql.dev/docs/plugins/dataloader#install)

To use the dataloader plugin you will need to install both the `dataloader` package and the Pothos dataloader plugin:

### [Setup](https://pothos-graphql.dev/docs/plugins/dataloader#setup)

### [loadable objects](https://pothos-graphql.dev/docs/plugins/dataloader#loadable-objects)

To create an object type that can be loaded with a dataloader use the new `builder.loadableObject` method:

It is **VERY IMPORTANT** to return values from `load` in an order that exactly matches the order of the requested IDs. The order is used to map results to their IDs, and if the results are returned in a different order, your GraphQL requests will end up with the wrong data. Correctly sorting results returned from a database or other data source can be tricky, so there this plugin has a `sort` option (described below) to simplify the sorting process. For more details on how the load function works, see the [dataloader docs](https://github.com/graphql/dataloader#batch-function).

When defining fields that return `User`s, you will now be able to return either a `string` (based in ids param of `load`), or a User object (type based on the return type of `loadUsersById`).

Pothos will detect when a resolver returns `string`, `number`, or `bigint` (typescript will constrain the allowed types to whatever is expected by the load function). If a resolver returns an object instead, Pothos knows it can skip the dataloader for that object.

### [loadable fields](https://pothos-graphql.dev/docs/plugins/dataloader#loadable-fields)

In some cases you may need more granular dataloaders. To handle these cases there is a new `t.loadable` method for defining fields with their own dataloaders.

### [loadableList fields for one-to-many relations](https://pothos-graphql.dev/docs/plugins/dataloader#loadablelist-fields-for-one-to-many-relations)

`loadable` fields can return lists, but do not work for loading a list of records from a single id.

The `loadableList` method can be used to define loadable fields that represent this kind of relationship.

### [loadableGroup fields for one-to-many relations](https://pothos-graphql.dev/docs/plugins/dataloader#loadablegroup-fields-for-one-to-many-relations)

In many cases, it's easier to load a flat list in a dataloader rather than loading a list of lists. the `loadableGroup` method simplifies this.

### [Accessing args on loadable fields](https://pothos-graphql.dev/docs/plugins/dataloader#accessing-args-on-loadable-fields)

By default the `load` method for fields does not have access to the fields arguments. This is because the dataloader will aggregate the calls across different selections and aliases that may not have the same arguments. To access the arguments, you can pass `byPath: true` in the fields options. This will cause the dataloader to only aggregate calls for the same "path" in the query, meaning all calls share the same arguments. This will allow you to access a 3rd `args` argument on the `load` method.

### [dataloader options](https://pothos-graphql.dev/docs/plugins/dataloader#dataloader-options)

You can provide additional options for your dataloaders using `loaderOptions`.

See [dataloader docs](https://github.com/graphql/dataloader#api) for all available options.

### [Manually using dataloader](https://pothos-graphql.dev/docs/plugins/dataloader#manually-using-dataloader)

Dataloaders for "loadable" objects can be accessed via their ref by passing in the context object for the current request. dataloaders are not shared across requests, so we need the context to get the correct dataloader for the current request:

### [Errors](https://pothos-graphql.dev/docs/plugins/dataloader#errors)

Calling dataloader.loadMany will resolve to a value like `(Type | Error)[]`. Your `load` function may also return results in that format if your loader can have parital failures. GraphQL does not have special handling for Error objects. Instead Pothos will map these results to something like `(Type | Promise<Type>)[]` where Errors are replaced with promises that will be rejected. This allows the normal graphql resolver flow to correctly handle these errors.

If you are using the `loadMany` method from a dataloader manually, you can apply the same mapping using the `rejectErrors` helper:

### [(Optional) Adding loaders to context](https://pothos-graphql.dev/docs/plugins/dataloader#optional-adding-loaders-to-context)

If you want to make dataloaders accessible via the context object directly, there is some additional setup required. Below are a few options for different ways you can load data from the context object. You can determine which of these options works best for you or add you own helpers.

First you'll need to update the types for your context type:

next you'll need to update your context factory function. The exact format of this depends on what graphql server implementation you are using.

Now you can use these helpers from your context object:

### [Using with the Relay plugin](https://pothos-graphql.dev/docs/plugins/dataloader#using-with-the-relay-plugin)

If you are using the Relay plugin, there is an additional method `loadableNode` that gets added to the builder. You can use this method to create `node` objects that work like other loadeble objects.

#### [Loadable connections](https://pothos-graphql.dev/docs/plugins/dataloader#loadable-connections)

To data-load a connection, you can use a combination of helpers:

- `builder.connectionObject` To create the connection and edge types
- `builder.loadable` with the `byPath` option to create a loadable field with access to arguments
- `t.arg.connectionArgs` to add the standard connection arguments to the field

### [Loadable Refs and Circular references](https://pothos-graphql.dev/docs/plugins/dataloader#loadable-refs-and-circular-references)

You may run into type errors if you define 2 loadable objects that circularly reference each other in their definitions.

There are a some general strategies to avoid this outlined in the [circular-references guide](https://pothos-graphql.dev/docs/guide/circular-references).

This plug also has methods for creating refs (similar to `builder.objectRef`) that can be used to split the definition and implementation of your types to avoid any issues with circular references.

All the plugin specific options should be passed when defining the ref. This allows the ref to be used by any method that accepts a ref to implement an object:

The above example is not useful on its own, but this pattern will allow these refs to be used with other that also allow you to define object types with additional behaviors.

### [Caching resources loaded manually in a resolver](https://pothos-graphql.dev/docs/plugins/dataloader#caching-resources-loaded-manually-in-a-resolver)

When manually loading a resource in a resolver it is not automatically added to the dataloader cache. If you want any resolved value to be stored in the cache in case it is used somewhere else in the query you can use the `cacheResolved` option.

The `cacheResolved` option takes a function that converts the loaded object into it's cache Key:

Whenever a resolver returns a User or list or Users, those objects will automatically be added the dataloaders cache, so they can be re-used in other parts of the query.

### [Sorting results from your `load` function](https://pothos-graphql.dev/docs/plugins/dataloader#sorting-results-from-your-load-function)

As mentioned above, the `load` function must return results in the same order as the provided array of IDs. Doing this correctly can be a little complicated, so this plugin includes an alternative. For any type or field that creates a dataloader, you can also provide a `sort` option which will correctly map your results into the correct order based on their ids. To do this, you will need to provide a function that accepts a result object, and returns its id.

This will also work with loadable nodes, interfaces, unions, or fields.

When sorting, if the list of results contains an Error the error is thrown because it can not be mapped to the correct location. This `sort` option should NOT be used for cases where the result list is expected to contain errors.

### [Shared `toKey` method.](https://pothos-graphql.dev/docs/plugins/dataloader#shared-tokey-method)

Defining multiple functions to extract the key from a loaded object can become redundant. In cases when you are using both `cacheResolved` and `sort` you can use a `toKey` function instead:

### [Subscriptions](https://pothos-graphql.dev/docs/plugins/dataloader#subscriptions)

Dataloaders are stored on the context object of the subscription. This means that values are cached across the full lifetime of the subscription.

To reset all data loaders for the current subscription, you can use the `clearAllDataLoaders` helper.

---

## URL: https://pothos-graphql.dev/docs/plugins/directives

Title: Directive plugin

URL Source: https://pothos-graphql.dev/docs/plugins/directives

Markdown Content:
A plugin for using schema directives with schemas generated by Pothos.

Schema Directives are not intended to be used with code first schemas, but there is a large existing community with several very useful directives based

### [Install](https://pothos-graphql.dev/docs/plugins/directives#install)

### [Setup](https://pothos-graphql.dev/docs/plugins/directives#setup)

The directives plugin allows you to define types for the directives your schema will use the `SchemaTypes` parameter. Each directive can define a set of locations the directive can appear, and an object type representing the arguments the directive accepts.

The valid locations for directives are:

- `ARGUMENT_DEFINITION`
- `ENUM_VALUE`
- `ENUM`
- `FIELD_DEFINITION`
- `INPUT_FIELD_DEFINITION`
- `INPUT_OBJECT`
- `INTERFACE`
- `OBJECT`
- `SCALAR`
- `SCHEMA`
- `UNION`

Pothos does not apply the directives itself, this plugin simply adds directive information to the extensions property of the underlying GraphQL type so that it can be consumed by other tools like `graphql-tools`.

By default this plugin uses the format that Gatsby uses (described [here](https://github.com/graphql/graphql-js/issues/1343#issuecomment-479871020)). This format [was not supported by older versions of `graphql-tools`](https://github.com/ardatan/graphql-tools/issues/2534). To support older versions of `graphql-tools` or directives that provide a schema visitor based on an older graphql-tools version like the rate-limit directive from the example above you can set the `useGraphQLToolsUnorderedDirectives` option. This option does not preserve the order that directives are defined in. This will be okay for most cases, but may cause issues if your directives need to be applied in a specific order.

To define directives on your fields or types, you can add a `directives` property in any of the supported locations using one of the following 2 formats:

Each of these applies the same 2 directives. The first format is preferred, especially when using directives that are sensitive to ordering, or can be repeated multiple times for the same location.

For most locations (On fields and types) the options object for the field or type will have a `directives` option which can be used to define directives.

To apply `SCHEMA` directives, you can use the `schemaDirectives` option on the `toSchema` method. `directives` on `toSchema` is reserved for the Directive implementations.

---

## URL: https://pothos-graphql.dev/docs/plugins/drizzle

Title: Drizzle plugin

URL Source: https://pothos-graphql.dev/docs/plugins/drizzle

Markdown Content:
This package is new, and depends on drizzle [RQBV2 API](https://rqbv2.drizzle-orm-fe.pages.dev/docs/rqb-v2#include-custom-fields). There are still some missing features, and the API may still change. This package currently requires using the `beta` tag for drizzle.

If you are upgrading from an older version of this plugin, please read the [drizzle migration guide](https://rqbv2.drizzle-orm-fe.pages.dev/docs/relations-v1-v2) and refer the the changelog for this package for Pothos specific changes.

The drizzle plugin is built on top of drizzles relational query builder, and requires that you define and configure all the relevant relations in your drizzle schema. See [https://rqbv2.drizzle-orm-fe.pages.dev/docs/relations-v2](https://rqbv2.drizzle-orm-fe.pages.dev/docs/relations-v2) for detailed documentation on the relations API.

Once you have configured you have configured you drizzle schema, you can initialize your Pothos SchemaBuilder with the drizzle plugin:

### [Integration with other plugins](https://pothos-graphql.dev/docs/plugins/drizzle#integration-with-other-plugins)

The drizzle plugin has integrations with several other plugins. While the `with-input` and `relay` plugins are not required, many examples will assume these plugins have been installed:

The `builder.drizzleObject` method can be used to define GraphQL Object types based on a drizzle table:

You will be able to "expose" any column in the table, and GraphQL fields do not need to match the names of the columns in your database. The returned `UserRef` can be used like any other `ObjectRef` in Pothos.

You will often want to define fields in your API that do not correspond to a specific database column. To do this, you can define fields with a resolver like any other Pothos object type:

In the above example, you can see that by default we have access to all columns of our table. For tables with many columns, it can be more efficient to only select the needed columns. You can configure the selected columns, and relations by passing a `select` option when defining the type:

Any selections added to the type will be available to consume in all resolvers. Columns that are not selected can still be exposed as before.

The previous example allows you to control what gets selected by default, but you often want to only select the columns that are required to fulfill a specific field. You can do this by adding the appropriate selections on each field:

Drizzles relational query builder allows you to define the relationships between your tables. The `builder.relation` method makes it easy to add fields to your GraphQL API that implement those relations:

The relation will automatically define GraphQL fields of the appropriate type based on the relation defined in your drizzle schema.

For some cases, exposing relations as fields without any customization works great, but in some cases you may want to apply some filtering or ordering to your relations. This can be done by specifying a `query` option on the relation:

The query API enables you to define args and convert them into parameters that will be passed into the relational query builder. You can read more about the relation query builder api [here](https://orm.drizzle.team/docs/rqb#querying)

Drizzle objects and relations allow you to define parts of your schema backed by your drizzle schema, but don't provide a clear entry point into this Graph of data. To make your drizzle objects queryable, we will need to add fields that return our drizzle objects. This can be done using the `t.drizzleField` method. This can be used to define fields on the root `Query` type, or any other object type in your schema:

The `resolve` function of a `drizzleField` will be passed a `query` function that MUST be called and passed to a drizzle `findOne` or `findMany` query. The `query` function optionally accepts any arguments that are normally passed into the query, and will merge these options with the selection used to resolve data for the nested GraphQL selections.

It is often useful to be able to define multiple object types based on the same table. This can be done using a feature called `variants`. The `variants` API consists of 3 parts:

- A `variant` option that can be passed instead of a name on `drizzleObjects`
- The ability to pass an `ObjectRef` to the `type` option of `t.relation` and other similar fields
- A `t.field` method that works similar to `t.relation, but is used to define a GraphQL field that references a variant of the same record.

Relay provides some very useful best practices that are useful for most GraphQL APIs. To make it easy to comply with these best practices, the drizzle plugin has built in support for defining relay `nodes` and `connections`.

Defining relay nodes works just like defining normal `drizzleObject`s, but requires specifying a column to use as the nodes `id` field.

The id column can also be set to a list of columns for types with a composite primary key.

To implement a relation as a connection, you can use `t.relatedConnection` instead of `t.relation`:

This will automatically define the `Connection`, and `Edge` types, and their respective fields. To customize the Connection and Edge types, options for these types can be passed as additional arguments to `t.relatedConnection`, just like `t.connection` from the relay plugin. See the [relay plugin docs](https://pothos-graphql.dev/docs/plugins/relay) for more details.

You can also define a `query` like with `t.relation`. The only difference with `t.relatedConnection` is that the `orderBy` format is slightly changed.

To comply with the relay spec and efficiently support backwards pagination, some queries need to be performed in reverse order, which requires inverting the orderBy clause. To do this automatically, the `t.relatedConnection` method accepts orderBy as an object like `{ asc: column }` or `{ desc: column }` rather than using the `asc(column)` and `desc(column)` helpers from drizzle. orderBy can still be returned as either a single column or array when ordering by multiple columns.

Ordering defaults to using the table `primaryKey`, and the orderBy columns will also be used to derive the connections cursor.

Similar to `t.drizzleField`, `t.drizzleConnection` allows you to define a connection field that acts as an entry point to your drizzle query. The `orderBy` in `t.drizzleConnection` works the same way as it does for `t.relatedConnection`

### [Indirect relations as connections](https://pothos-graphql.dev/docs/plugins/drizzle#indirect-relations-as-connections)

In many cases, you can define many to many connections via drizzle relations, allowing the `relatedConnection` API to work across more complex relations. In some cases you may want to define a connection for a relation not expressed directly as a relation in your drizzle schema. For these cases, you can use the `drizzleConnectionHelpers`, which allows you to define connection with the `t.connection` API.

The above example assumes that you are paginating a relation to a join table, where the pagination args are applied based on the relation to that join table, but the nodes themselves are nested deeper.

`drizzleConnectionHelpers` can also be used to manually create a connection where the edge and connections share the same model, and pagination happens directly on a relation to nodes type (even if that relation is nested).

Arguments, ordering and filtering can also be defined in the helpers:

### [Extending connection edges](https://pothos-graphql.dev/docs/plugins/drizzle#extending-connection-edges)

In some cases you may want to expose some data from an indirect connection on the edge object.

### [`drizzleConnectionHelpers` for non-relation connections](https://pothos-graphql.dev/docs/plugins/drizzle#drizzleconnectionhelpers-for-non-relation-connections)

You can also use `drizzleConnectionHelpers` for non-relation connections where you want a connection where your edges and nodes are not the same type.

Note that when doing this, you need to be careful to properly merge the `where` clause generated by the connection helper with any additional `where` clause you need to apply to your query

---

## URL: https://pothos-graphql.dev/docs/plugins/errors

Title: Errors plugin

URL Source: https://pothos-graphql.dev/docs/plugins/errors

Markdown Content:
A plugin for easily including error types in your GraphQL schema and hooking up error types to resolvers

### [Install](https://pothos-graphql.dev/docs/plugins/errors#install)

### [Setup](https://pothos-graphql.dev/docs/plugins/errors#setup)

Ensure that the target in your `tsconfig.json` is set to `es6` or higher (default is `es3`).

### [Example Usage](https://pothos-graphql.dev/docs/plugins/errors#example-usage)

The above example will produce a GraphQL schema that looks like:

This field can be queried using fragments like:

This plugin works by wrapping fields that define error options in a union type. This union consists of an object type for each error type defined for the field, and a Success object type that wraps the returned data. If the fields resolver throws an instance of one of the defined errors, the errors plugin will automatically resolve to the corresponding error object type.

### [Builder options](https://pothos-graphql.dev/docs/plugins/errors#builder-options)

- `defaultTypes`: An array of Error classes to include in every field with error handling.
- `directResult`: Sets the default for `directResult` option on fields (only affects non-list fields)
- `defaultResultOptions`: Sets the defaults for `result` option on fields.

  - `name`: Function to generate a custom name on the generated result types.

- `defaultUnionOptions`: Sets the defaults for `result` option on fields.
  - `name`: Function to generate a custom name on the generated union types.

### [Options on Fields](https://pothos-graphql.dev/docs/plugins/errors#options-on-fields)

- `types`: An array of Error classes to catch and handle as error objects in the schema. Will be merged with `defaultTypes` from builder.
- `union`: An options object for the union type. Can include any normal union type options, and `name` option for setting a custom name for the union type.
- `result`: An options object for result object type. Can include any normal object type options, and `name` option for setting a custom name for the result type.
- `dataField`: An options object for the data field on the result object. This field will be named `data` by default, but can be written by passsing a custom `name` option.
- `directResult`: Boolean, can only be set to true for non-list fields. This will directly include the fields type in the union rather than creating an intermediate Result object type. This will throw at build time if the type is not an object type.

### [Recommended Usage](https://pothos-graphql.dev/docs/plugins/errors#recommended-usage)

1.  Set up an Error interface
2.  Create a BaseError object type
3.  Include the Error interface in any custom Error types you define
4.  Include the BaseError type in the `defaultTypes` in the builder config

This pattern will allow you to consistently query your schema using a `... on Error { message }` fragment since all Error classes extend that interface. If your client want's to query details of more specialized error types, they can just add a fragment for the errors it cares about. This pattern should also make it easier to make future changes without unexpected breaking changes for your clients.

The follow is a small example of this pattern:

### [With zod plugin](https://pothos-graphql.dev/docs/plugins/errors#with-zod-plugin)

To use this in combination with the zod plugin, ensure that that errors plugin is listed BEFORE the zod plugin in your plugin list.

Once your plugins are set up, you can define types for a ZodError, the same way you would for any other error type. Below is a simple example of how this can be done, but the specifics of how you structure your error types are left up to you.

Example query:

### [With the dataloader plugin](https://pothos-graphql.dev/docs/plugins/errors#with-the-dataloader-plugin)

To use this in combination with the dataloader plugin, ensure that that errors plugin is listed BEFORE the dataloader plugin in your plugin list.

If a field with `errors` returns a `loadableObject`, or `loadableNode` the errors plugin will now catch errors thrown when loading ids returned by the `resolve` function.

If the field is a `List` field, errors that occur when resolving objects from `ids` will not be handled by the errors plugin. This is because those errors are associated with each item in the list rather than the list field itself. In the future, the dataloader plugin may have an option to throw an error at the field level if any items can not be loaded, which would allow the error plugin to handle these types of errors.

### [With the prisma plugin](https://pothos-graphql.dev/docs/plugins/errors#with-the-prisma-plugin)

To use this in combination with the prisma plugin, ensure that that errors plugin is listed BEFORE the prisma plugin in your plugin list. This will enable `errors` option to work correctly with any field builder method from the prisma plugin.

`errors` can be configured for any field, but if there is an error pre-loading a relation the error will always surfaced at the field that executed the query. Because there are cases that fall back to executing queries for relation fields, these fields may still have errors if the relation was not pre-loaded. Detection of nested relations will continue to work if those relations use the `errors` plugin

### [List item errors](https://pothos-graphql.dev/docs/plugins/errors#list-item-errors)

For fields that return lists, you can specify `itemErrors` to wrap the list items in a union type so that errors can be handled per-item rather than replacing the whole list with an error.

The `itemErrors` options are exactly the same as the `errors` options, but they are applied to each item in the list rather than the whole list.

This will produce a GraphQL schema that looks like:

Item errors also works with both sync and async iterators (in graphql@>=17, or other executors that support the @stream directive):

When an error is yielded, an error result will be added into the list, if the generator throws an error, the error will be added to the list, and no more results will be returned for that field

You can also use the `errors` and `itemErrors` options together:

This will produce a GraphQL schema that looks like:

---

## URL: https://pothos-graphql.dev/docs/plugins/mocks

Title: Mocks plugin

URL Source: https://pothos-graphql.dev/docs/plugins/mocks

Markdown Content:
Mocks plugin

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 1: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Add GraphQL plugin](https://pothos-graphql.dev/docs/plugins/add-graphql)[Complexity plugin](https://pothos-graphql.dev/docs/plugins/complexity)[Dataloader plugin](https://pothos-graphql.dev/docs/plugins/dataloader)[Directive plugin](https://pothos-graphql.dev/docs/plugins/directives)[Drizzle plugin](https://pothos-graphql.dev/docs/plugins/drizzle)[Errors plugin](https://pothos-graphql.dev/docs/plugins/errors)[Federation plugin](https://pothos-graphql.dev/docs/plugins/federation)[Mocks plugin](https://pothos-graphql.dev/docs/plugins/mocks)[Relay plugin](https://pothos-graphql.dev/docs/plugins/relay)[Auth plugin](https://pothos-graphql.dev/docs/plugins/scope-auth)[Simple objects plugin](https://pothos-graphql.dev/docs/plugins/simple-objects)[Smart subscriptions plugin](https://pothos-graphql.dev/docs/plugins/smart-subscriptions)[SubGraph plugin](https://pothos-graphql.dev/docs/plugins/sub-graph)[Tracing plugin](https://pothos-graphql.dev/docs/plugins/tracing)[With-Input plugin](https://pothos-graphql.dev/docs/plugins/with-input)[Zod Validation plugin](https://pothos-graphql.dev/docs/plugins/zod)

[Prisma](https://pothos-graphql.dev/docs/plugins/prisma)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

Mocks plugin

[Plugins](https://pothos-graphql.dev/docs/plugins)

# Mocks plugin

A simple plugin for adding resolver mocks to a GraphQL schema.

## [Usage](https://pothos-graphql.dev/docs/plugins/mocks#usage)

### [Install](https://pothos-graphql.dev/docs/plugins/mocks#install)

npm pnpm yarn bun

`npm install --save @pothos/plugin-mocks`

### [Setup](https://pothos-graphql.dev/docs/plugins/mocks#setup)

```
import MocksPlugin from '@pothos/plugin-mocks';
const builder = new SchemaBuilder({
  plugins: [MocksPlugin],
});
```

### [Adding mocks](https://pothos-graphql.dev/docs/plugins/mocks#adding-mocks)

You can mock any field by adding a mock in the options passed to `builder.toSchema` under `mocks.{typeName}.{fieldName}`.

```
builder.queryType({
  fields: (t) => ({
    someField: t.string({
      resolve: () => {
        throw new Error('Not implemented');
      },
    }),
  }),
});

builder.toSchema({
  mocks: {
    Query: {
      someField: (parent, args, context, info) => 'Mock result!',
    },
  },
});
```

Mocks will replace the resolve functions any time a mocked field is executed. A schema can be built multiple times with different mocks.

### [Adding mocks for subscribe functions](https://pothos-graphql.dev/docs/plugins/mocks#adding-mocks-for-subscribe-functions)

To add a mock for a subscriber you can nest the mocks for subscribe and resolve in an object:

```
builder.subscriptionType({
  fields: (t) => ({
    someField: t.string({
      resolve: () => {
        throw new Error('Not implemented');
      },
      subscribe: () => {
        throw new Error('Not implemented');
      },
    }),
  }),
});

builder.toSchema({
  mocks: {
    Subscription: {
      someField: {
        resolve: (parent, args, context, info) => 'Mock result!',
        subscribe: (parent, args, context, info) => {
          /* return a mock async iterator */
        },
      },
    },
  },
});
```

[Federation plugin Federation plugin docs for Pothos](https://pothos-graphql.dev/docs/plugins/federation)[Relay plugin Relay plugin docs for Pothos](https://pothos-graphql.dev/docs/plugins/relay)

### On this page

[Usage](https://pothos-graphql.dev/docs/plugins/mocks#usage)[Install](https://pothos-graphql.dev/docs/plugins/mocks#install)[Setup](https://pothos-graphql.dev/docs/plugins/mocks#setup)[Adding mocks](https://pothos-graphql.dev/docs/plugins/mocks#adding-mocks)[Adding mocks for subscribe functions](https://pothos-graphql.dev/docs/plugins/mocks#adding-mocks-for-subscribe-functions)

---

## URL: https://pothos-graphql.dev/docs/plugins/prisma

Title: Prisma plugin

URL Source: https://pothos-graphql.dev/docs/plugins/prisma

Markdown Content:
Prisma plugin

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 1: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Add GraphQL plugin](https://pothos-graphql.dev/docs/plugins/add-graphql)[Complexity plugin](https://pothos-graphql.dev/docs/plugins/complexity)[Dataloader plugin](https://pothos-graphql.dev/docs/plugins/dataloader)[Directive plugin](https://pothos-graphql.dev/docs/plugins/directives)[Drizzle plugin](https://pothos-graphql.dev/docs/plugins/drizzle)[Errors plugin](https://pothos-graphql.dev/docs/plugins/errors)[Federation plugin](https://pothos-graphql.dev/docs/plugins/federation)[Mocks plugin](https://pothos-graphql.dev/docs/plugins/mocks)[Relay plugin](https://pothos-graphql.dev/docs/plugins/relay)[Auth plugin](https://pothos-graphql.dev/docs/plugins/scope-auth)[Simple objects plugin](https://pothos-graphql.dev/docs/plugins/simple-objects)[Smart subscriptions plugin](https://pothos-graphql.dev/docs/plugins/smart-subscriptions)[SubGraph plugin](https://pothos-graphql.dev/docs/plugins/sub-graph)[Tracing plugin](https://pothos-graphql.dev/docs/plugins/tracing)[With-Input plugin](https://pothos-graphql.dev/docs/plugins/with-input)[Zod Validation plugin](https://pothos-graphql.dev/docs/plugins/zod)

[Prisma](https://pothos-graphql.dev/docs/plugins/prisma)

[Setup](https://pothos-graphql.dev/docs/plugins/prisma/setup)[Prisma Objects](https://pothos-graphql.dev/docs/plugins/prisma/objects)[Relations](https://pothos-graphql.dev/docs/plugins/prisma/relations)[Selections](https://pothos-graphql.dev/docs/plugins/prisma/selections)[Relay](https://pothos-graphql.dev/docs/plugins/prisma/relay)[Connections](https://pothos-graphql.dev/docs/plugins/prisma/connections)[Type variants](https://pothos-graphql.dev/docs/plugins/prisma/variants)[Indirect relations](https://pothos-graphql.dev/docs/plugins/prisma/indirect-relations)[Interfaces](https://pothos-graphql.dev/docs/plugins/prisma/interfaces)[Prisma Utils](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils)[Prisma without a plugin](https://pothos-graphql.dev/docs/plugins/prisma/without-a-plugin)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

Prisma plugin

[Plugins](https://pothos-graphql.dev/docs/plugins)

# Prisma plugin

This plugin provides tighter integration with prisma, making it easier to define prisma based object types, and helps solve n+1 queries for relations. It also has integrations for the relay plugin to make defining nodes and connections easy and efficient.

This plugin is NOT required to use prisma with Pothos, but does make things a lot easier and more efficient. See the [Using Prisma without a plugin](https://pothos-graphql.dev/docs/plugins/prisma#using-prisma-without-a-plugin) section below for more details.

## [Features](https://pothos-graphql.dev/docs/plugins/prisma#features)

- 🎨 Quickly define GraphQL types based on your Prisma models
- 🦺 Strong type-safety throughout the entire API
- 🤝 Automatically resolve relationships defined in your database
- 🎣 Automatic Query optimization to efficiently load the specific data needed to resolve a query (solves common N+1 issues)
- 💅 Types and fields in GraphQL schema are not implicitly tied to the column names or types in your database.
- 🔀 Relay integration for defining nodes and connections that can be efficiently loaded.
- 📚 Supports multiple GraphQL models based on the same Database model
- 🧮 Count fields can easily be added to objects and connections

## [Example](https://pothos-graphql.dev/docs/plugins/prisma#example)

Here is a quick example of what an API using this plugin might look like. There is a more thorough breakdown of what the methods and options used in the example below.

```
// Create an object type based on a prisma model
// without providing any custom type information
builder.prismaObject('User', {
  fields: (t) => ({
    // expose fields from the database
    id: t.exposeID('id'),
    email: t.exposeString('email'),
    bio: t.string({
      // automatically load the bio from the profile
      // when this field is queried
      select: {
        profile: {
          select: {
            bio: true,
          },
        },
      },
      // user will be typed correctly to include the
      // selected fields from above
      resolve: (user) => user.profile.bio,
    }),
    // Load posts as list field.
    posts: t.relation('posts', {
      args: {
        oldestFirst: t.arg.boolean(),
      },
      // Define custom query options that are applied when
      // loading the post relation
      query: (args, context) => ({
        orderBy: {
          createdAt: args.oldestFirst ? 'asc' : 'desc',
        },
      }),
    }),
    // creates relay connection that handles pagination
    // using prisma's built in cursor based pagination
    postsConnection: t.relatedConnection('posts', {
      cursor: 'id',
    }),
  }),
});

// Create a relay node based a prisma model
builder.prismaNode('Post', {
  id: { field: 'id' },
  fields: (t) => ({
    title: t.exposeString('title'),
    author: t.relation('author'),
  }),
});

builder.queryType({
  fields: (t) => ({
    // Define a field that issues an optimized prisma query
    me: t.prismaField({
      type: 'User',
      resolve: async (query, root, args, ctx, info) =>
        prisma.user.findUniqueOrThrow({
          // the `query` argument will add in `include`s or `select`s to
          // resolve as much of the request in a single query as possible
          ...query,
          where: { id: ctx.userId },
        }),
    }),
  }),
});
```

Given this schema, you would be able to resolve a query like the following with a single prisma query (which will still result in a few optimized SQL queries).

```
query {
  me {
    email
    posts {
      title
      author {
        id
      }
    }
  }
}
```

A query like

```
query {
  me {
    email
    posts {
      title
      author {
        id
      }
    }
    oldPosts: posts(oldestFirst: true) {
      title
      author {
        id
      }
    }
  }
}
```

Will result in 2 calls to prisma, one to resolve everything except `oldPosts`, and a second to resolve everything inside `oldPosts`. Prisma can only resolve each relation once in a single query, so we need a separate to handle the second `posts` relation.

[Zod Validation plugin Zod plugin docs for Pothos](https://pothos-graphql.dev/docs/plugins/zod)[Setup Setting up the Prisma plugin](https://pothos-graphql.dev/docs/plugins/prisma/setup)

### On this page

[Features](https://pothos-graphql.dev/docs/plugins/prisma#features)[Example](https://pothos-graphql.dev/docs/plugins/prisma#example)

---

## URL: https://pothos-graphql.dev/docs/plugins/relay

Title: Relay plugin

URL Source: https://pothos-graphql.dev/docs/plugins/relay

Markdown Content:
The Relay plugin adds a number of builder methods and helper functions to simplify building a relay compatible schema.

### [Install](https://pothos-graphql.dev/docs/plugins/relay#install)

### [Setup](https://pothos-graphql.dev/docs/plugins/relay#setup)

### [Options](https://pothos-graphql.dev/docs/plugins/relay#options)

The `relay` options object passed to builder can contain the following properties:

- `idFieldName`: The name of the field that contains the global id for the node. Defaults to `id`.
- `idFieldOptions`: Options to pass to the id field.
- `clientMutationId`: `omit` (default) | `required` | `optional`. Determines if clientMutationId fields are created on `relayMutationFields`, and if they are required.
- `cursorType`: `String` | `ID`. Determines type used for cursor fields. Defaults to `String`
- `nodeQueryOptions`: Options for the `node` field on the query object, set to false to omit the field
- `nodesQueryOptions`: Options for the `nodes` field on the query object, set to false to omit the field
- `nodeTypeOptions`: Options for the `Node` interface type
- `pageInfoTypeOptions`: Options for the `TypeInfo` object type
- `clientMutationIdFieldOptions`: Options for the `clientMutationId` field on connection objects
- `clientMutationIdInputOptions`: Options for the `clientMutationId` input field on connections fields
- `mutationInputArgOptions`: Options for the Input object created for each connection field
- `cursorFieldOptions`: Options for the `cursor` field on an edge object.
- `nodeFieldOptions`: Options for the `node` field on an edge object.
- `edgesFieldOptions`: Options for the `edges` field on a connection object.
- `pageInfoFieldOptions`: Options for the `pageInfo` field on a connection object.
- `hasNextPageFieldOptions`: Options for the `hasNextPage` field on the `PageInfo` object.
- `hasPreviousPageFieldOptions`: Options for the `hasPreviousPage` field on the `PageInfo` object.
- `startCursorFieldOptions`: Options for the `startCursor` field on the `PageInfo` object.
- `endCursorFieldOptions`: Options for the `endCursor` field on the `PageInfo` object.
- `beforeArgOptions`: Options for the `before` arg on a connection field.
- `afterArgOptions`: Options for the `after` arg on a connection field.
- `firstArgOptions`: Options for the `first` arg on a connection field.
- `lastArgOptions`: Options for the `last` arg on a connection field.
- `defaultConnectionTypeOptions`: Default options for the `Connection` Object types.
- `defaultEdgeTypeOptions`: Default options for the `Edge` Object types.
- `defaultPayloadTypeOptions`: Default options for the `Payload` Object types.
- `defaultMutationInputTypeOptions`: default options for the mutation `Input` types.
- `nodesOnConnection`: If true, the `nodes` field will be added to the `Connection` object types.
- `defaultConnectionFieldOptions`: Default options for connection fields defined with t.connection
- `brandLoadedObjects`: Defaults to `true`. This will add a hidden symbol to objects returned from the `load` methods of Nodes that allows the default `resolveType` implementation to identify the type of the node. When this is enabled, you will not need to implement an `isTypeOf` check for most common patterns.

### [Creating Nodes](https://pothos-graphql.dev/docs/plugins/relay#creating-nodes)

To create objects that extend the `Node` interface, you can use the new `builder.node` method.

`builder.node` will create an object type that implements the `Node` interface. It will also create the `Node` interface the first time it is used. The `resolve` function for `id` should return a number or string, which will be converted to a globalID. The relay plugin adds to new query fields `node` and `nodes` which can be used to directly fetch nodes using global IDs by calling the provided `loadOne` or `loadMany` method. Each node will only be loaded once by id, and cached if the same node is loaded multiple times inn the same request. You can provide `loadWithoutCache` or `loadManyWithoutCache` instead if caching is not desired, or you are already using a caching datasource like a dataloader.

Nodes may also implement an `isTypeOf` method which can be used to resolve the correct type for lists of generic nodes. When using a class as the type parameter, the `isTypeOf` method defaults to using an `instanceof` check, and falls back to checking the constructor property on the prototype. The means that for many cases if you are using classes in your type parameters, and all your values are instances of those classes, you won't need to implement an `isTypeOf` method, but it is usually better to explicitly define that behavior.

By default (unless `brandLoadedObjects` is set to `false`) any nodes loaded through one of the `load*` methods will be branded so that the default `resolveType` method can identify the GraphQL type for the loaded object. This means `isTypeOf` is only required for `union` and `interface` fields that return node objects that are manually loaded, where the union or interface does not have a custom `resolveType` method that knows how to resolve the node type.

#### [parsing node ids](https://pothos-graphql.dev/docs/plugins/relay#parsing-node-ids)

By default all node ids are parsed as string. This behavior can be customized by providing a custom parse function for your node's ID field:

### [Global IDs](https://pothos-graphql.dev/docs/plugins/relay#global-ids)

To make it easier to create globally unique ids the relay plugin adds new methods for creating globalID fields.

The returned IDs can either be a string (which is expected to already be a globalID), or an object with the an `id` and a `type`, The type can be either the name of a name as a string, or any object that can be used in a type parameter.

There are also new methods for adding globalIDs in arguments or fields of input types:

globalIDs used in arguments expect the client to send a globalID string, but will automatically be converted to an object with 2 properties (`id` and `typename`) before they are passed to your resolver in the arguments object.

#### [Limiting global ID args to specific types](https://pothos-graphql.dev/docs/plugins/relay#limiting-global-id-args-to-specific-types)

`globalID` input's can be configured to validate the type of the globalID. This is useful if you only want to accept IDs for specific node types.

### [Creating Connections](https://pothos-graphql.dev/docs/plugins/relay#creating-connections)

The `t.connection` field builder method can be used to define connections. This method will automatically create the `Connection` and `Edge` objects used by the connection, and add `before`, `after`, `first`, and `last` arguments. The first time this method is used, it will also create the `PageInfo` type.

Manually implementing connections can be cumbersome, so there are a couple of helper methods that can make resolving connections a little easier.

For limit/offset based apis:

`resolveOffsetConnection` has a few default limits to prevent unintentionally allowing too many records to be fetched at once. These limits can be configure using the following options:

For APIs where you have the full array available you can use `resolveArrayConnection`, which works just like `resolveOffsetConnection` and accepts the same options.

Cursor based pagination can be implemented using the `resolveCursorConnection` method. The following example uses prisma, but a similar solution should work with any data store that supports limits, ordering, and filtering.

### [Relay Mutations](https://pothos-graphql.dev/docs/plugins/relay#relay-mutations)

You can use the `relayMutationField` method to define relay compliant mutation fields. This method will generate a mutation field, an input object with a `clientMutationId` field, and an output object with the corresponding `clientMutationId`.

Example ussage:

Which produces the following graphql types:

The `relayMutationField` has 4 arguments:

- `name`: Name of the mutation field
- `inputOptions`: Options for the `input` object or a ref to an existing input object
- `fieldOptions`: Options for the mutation field
- `payloadOptions`: Options for the Payload object

The `inputOptions` has a couple of non-standard options:

- `name` which can be used to set the name of the input object
- `argName` which can be used to overwrite the default arguments name (`input`).

The `payloadOptions` object also accepts a `name` property for setting the name of the payload object.

You can also access refs for the created input and payload objects so you can re-use them in other fields:

### [Reusing connection objects](https://pothos-graphql.dev/docs/plugins/relay#reusing-connection-objects)

In some cases you may want to create a connection object type that is shared by multiple fields. To do this, you will need to create the connection object separately and then create a fields using a ref to your connection object:

`builder.connectionObject` creates the connect object type and the associated Edge type. `t.arg.connectionArgs()` will create the default connection args.

### [Reusing edge objects](https://pothos-graphql.dev/docs/plugins/relay#reusing-edge-objects)

Similarly you can directly create and re-use edge objects

`builder.connectionObject` creates the connect object type and the associated Edge type. `t.arg.connectionArgs()` will create the default connection args.

### [Expose nodes](https://pothos-graphql.dev/docs/plugins/relay#expose-nodes)

The `t.node` and `t.nodes` methods can be used to add additional node fields. the expected return values of `id` and `ids` fields is the same as the resolve value of `t.globalID`, and can either be a globalID or an object with and an `id` and a `type`.

Loading nodes by `id` uses a request cache, so the same node will only be loaded once per request, even if it is used multiple times across the schema.

### [decoding and encoding global ids](https://pothos-graphql.dev/docs/plugins/relay#decoding-and-encoding-global-ids)

The relay plugin exports `decodeGlobalID` and `encodeGlobalID` as helper methods for interacting with global IDs directly. If you accept a global ID as an argument you can use the `decodeGlobalID` function to decode it:

### [Using custom encoding for global ids](https://pothos-graphql.dev/docs/plugins/relay#using-custom-encoding-for-global-ids)

In some cases you may want to encode global ids differently than the build in ID encoding. To do this, you can pass a custom encoding and decoding function into the relay options of the builder:

### [Using custom resolve for node and or nodes field](https://pothos-graphql.dev/docs/plugins/relay#using-custom-resolve-for-node-and-or-nodes-field)

If you need to customize how nodes are loaded for the `node` and or `nodes` fields you can provide custom resolve functions in the builder options for these fields:

### [Extending all connections](https://pothos-graphql.dev/docs/plugins/relay#extending-all-connections)

There are 2 builder methods for adding fields to all connection objects: `t.globalConnectionField` and `t.globalConnectionFields`. These methods work like many of the other methods on the builder for adding fields to objects or interfaces.

In the above example, we are just returning a static number for our `totalCount` field. To make this more useful, we need to have our resolvers for each connection actually return an object that contains a totalCount for us. To guarantee that resolvers correctly implement this behavior, we can define custom properties that must be returned from connection resolvers when we set up our builder:

Now typescript will ensure that objects returned from each connection resolver include a totalCount property, which we can use in our connection fields:

Note that adding additional required properties will make it harder to use the provided connection helpers since they will not automatically return your custom properties. You will need to manually add in any custom props after getting the result from the helpers:

### [Changing nullability of edges and nodes](https://pothos-graphql.dev/docs/plugins/relay#changing-nullability-of-edges-and-nodes)

If you want to change the nullability of the `edges` field on a `Connection` or the `node` field on an `Edge` you can configure this in 2 ways:

#### [Globally](https://pothos-graphql.dev/docs/plugins/relay#globally)

The types provided for `DefaultEdgesNullability` and `DefaultNodeNullability` must match the values provided in the nullable option of `edgesFieldOptions` and `nodeFieldOptions` respectively. This will set the default nullability for all connections created by your builder.

nullability for `edges` fields defaults to `{ list: options.defaultFieldNullability, items: true }` and the nullability of `node` fields is the same as `options.defaultFieldNullability` (which defaults to `true`).

#### [Per connection](https://pothos-graphql.dev/docs/plugins/relay#per-connection)

### [Extending the `Node` interface](https://pothos-graphql.dev/docs/plugins/relay#extending-the-node-interface)

Use the `nodeInterfaceRef` method of your Builder.

For example, to add a new derived field on the interface:

---

## URL: https://pothos-graphql.dev/docs/plugins/simple-objects

Title: Simple objects plugin

URL Source: https://pothos-graphql.dev/docs/plugins/simple-objects

Markdown Content:
Simple objects plugin

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 1: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Add GraphQL plugin](https://pothos-graphql.dev/docs/plugins/add-graphql)[Complexity plugin](https://pothos-graphql.dev/docs/plugins/complexity)[Dataloader plugin](https://pothos-graphql.dev/docs/plugins/dataloader)[Directive plugin](https://pothos-graphql.dev/docs/plugins/directives)[Drizzle plugin](https://pothos-graphql.dev/docs/plugins/drizzle)[Errors plugin](https://pothos-graphql.dev/docs/plugins/errors)[Federation plugin](https://pothos-graphql.dev/docs/plugins/federation)[Mocks plugin](https://pothos-graphql.dev/docs/plugins/mocks)[Relay plugin](https://pothos-graphql.dev/docs/plugins/relay)[Auth plugin](https://pothos-graphql.dev/docs/plugins/scope-auth)[Simple objects plugin](https://pothos-graphql.dev/docs/plugins/simple-objects)[Smart subscriptions plugin](https://pothos-graphql.dev/docs/plugins/smart-subscriptions)[SubGraph plugin](https://pothos-graphql.dev/docs/plugins/sub-graph)[Tracing plugin](https://pothos-graphql.dev/docs/plugins/tracing)[With-Input plugin](https://pothos-graphql.dev/docs/plugins/with-input)[Zod Validation plugin](https://pothos-graphql.dev/docs/plugins/zod)

[Prisma](https://pothos-graphql.dev/docs/plugins/prisma)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

Simple objects plugin

[Plugins](https://pothos-graphql.dev/docs/plugins)

# Simple objects plugin

The Simple Objects Plugin provides a way to define objects and interfaces without defining type definitions for those objects, while still getting full type safety.

## [Usage](https://pothos-graphql.dev/docs/plugins/simple-objects#usage)

### [Install](https://pothos-graphql.dev/docs/plugins/simple-objects#install)

npm pnpm yarn bun

`npm install --save @pothos/plugin-simple-objects`

### [Setup](https://pothos-graphql.dev/docs/plugins/simple-objects#setup)

```
import SimpleObjectsPlugin from '@pothos/plugin-simple-objects';
const builder = new SchemaBuilder({
  plugins: [SimpleObjectsPlugin],
});
```

### [Example](https://pothos-graphql.dev/docs/plugins/simple-objects#example)

```
import SchemaBuilder from '@pothos/core';
import SimpleObjectsPlugin from '@pothos/plugin-simple-objects';

const builder = new SchemaBuilder({
  plugins: [SimpleObjectsPlugin],
});

const ContactInfo = builder.simpleObject('ContactInfo', {
  fields: (t) => ({
    email: t.string({
      nullable: false,
    }),
    phoneNumber: t.string({
      nullable: true,
    }),
  }),
});

const Node = builder.simpleInterface('Node', {
  fields: (t) => ({
    id: t.id({
      nullable: false,
    }),
  }),
});

const UserType = builder.simpleObject(
  'User',
  {
    interfaces: [Node],
    fields: (t) => ({
      firstName: t.string(),
      lastName: t.string(),
      contactInfo: t.field({
        type: ContactInfo,
        nullable: false,
      }),
    }),
  },
  // You can add additional fields with resolvers with a third fields argument
  (t) => ({
    fullName: t.string({
      resolve: (user) => `${user.firstName} ${user.lastName}`,
    }),
  }),
);

builder.queryType({
  fields: (t) => ({
    user: t.field({
      type: UserType,
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: (parent, args, { User }) => {
        return {
          id: '1003',
          firstName: 'Leia',
          lastName: 'Organa',
          contactInfo: {
            email: 'leia@example.com',
            phoneNumber: null,
          },
        };
      },
    }),
  }),
});
```

## [Extending simple objects](https://pothos-graphql.dev/docs/plugins/simple-objects#extending-simple-objects)

In some cases, you may want to add more complex fields with resolvers or args where the value isn't just passed down from the parent.

In these cases, you can either add the field in the 3rd arg (fields) as shown above, or you can add additional fields to the type using methods like `builder.objectType`:

```
builder.objectType(UserType, (t) => ({
  fullName: t.string({
    resolve: (user) => `${user.firstName} ${user.lastName}`,
  }),
}));
```

## [Limitations](https://pothos-graphql.dev/docs/plugins/simple-objects#limitations)

When using simpleObjects in combination with other plugins like authorization, those plugins may use `unknown` as the parent type in some custom fields (eg. `parent` of a permission check function on a field).

[Auth plugin Auth plugin docs for Pothos](https://pothos-graphql.dev/docs/plugins/scope-auth)[Smart subscriptions plugin Smart subscriptions plugin docs for Pothos](https://pothos-graphql.dev/docs/plugins/smart-subscriptions)

### On this page

[Usage](https://pothos-graphql.dev/docs/plugins/simple-objects#usage)[Install](https://pothos-graphql.dev/docs/plugins/simple-objects#install)[Setup](https://pothos-graphql.dev/docs/plugins/simple-objects#setup)[Example](https://pothos-graphql.dev/docs/plugins/simple-objects#example)[Extending simple objects](https://pothos-graphql.dev/docs/plugins/simple-objects#extending-simple-objects)[Limitations](https://pothos-graphql.dev/docs/plugins/simple-objects#limitations)

---

## URL: https://pothos-graphql.dev/docs/plugins/smart-subscriptions

Title: Smart subscriptions plugin

URL Source: https://pothos-graphql.dev/docs/plugins/smart-subscriptions

Markdown Content:
This plugin provides a way of turning queries into GraphQL subscriptions. Each field, Object, and Interface in a schema can define subscriptions to be registered when that field or type is used in a smart subscription.

The basic flow of a smart subscription is:

1.  Run the query the smart subscription is based on and push the initial result of that query to the subscription

2.  As the query is resolved, register any subscriptions defined on fields or types that where used in the query

3.  When any of the subscriptions are triggered, re-execute the query and push the updated data to the subscription.

There are additional options which will allow only the sub-tree of a field/type that triggered a fetch to re-resolved.

This pattern makes it easy to define subscriptions without having to worry about what parts of your schema are accessible via the subscribe query, since any type or field can register a subscription.

### [Install](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#install)

### [Setup](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#setup)

#### [Helper for usage with async iterators](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#helper-for-usage-with-async-iterators)

### [Creating a smart subscription](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#creating-a-smart-subscription)

Adding `smartSubscription: true` to a query field creates a field of the same name on the `Subscriptions` type. The `subscribe` option is optional, and shows how a field can register a subscription.

This would be queried as:

### [registering subscriptions for objects](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#registering-subscriptions-for-objects)

This will create a new subscription for every `Poll` that is returned in the subscription. When the query is updated to fetch a new set of results because a subscription event fired, the subscribe call will be called again for each poll in the new result set.

#### [more options](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#more-options)

Passing a `filter` function will filter the events, any only cause a re-fetch if it returns true.

`invalidateCache` is called before refetching data, to allow any cache invalidation to happen so that when the new data is loaded, results are not stale.

`refetch` enables directly refetching the current object. When refetch is provided and a subscription event fires for the current object, or any of its children, other parts of the query that are not dependents of this object will no be refetched.

### [registering subscriptions for fields](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#registering-subscriptions-for-fields)

#### [more options for fields](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#more-options-for-fields)

Similar to subscriptions on objects, fields can pass `filter` and `invalidateCache` functions when registering a subscription. Rather than passing a `refetch` function, you can set `canRefetch` to `true` in the field options. This will re-run the current resolve function to update it (and it's children) without having to re-run the rest of the query.

### [Known limitations](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#known-limitations)

- Currently value passed to `filter` and `invalidateCache` is typed as `unknown`. This should be improved in the future.
- Does not work with list fields implemented with async-generators (used for `@stream` queries)

---

## URL: https://pothos-graphql.dev/docs/plugins/sub-graph

Title: SubGraph plugin

URL Source: https://pothos-graphql.dev/docs/plugins/sub-graph

Markdown Content:
A plugin for creating sub-selections of your graph. This allows you to use the same code/types for multiple variants of your API.

One common use case for this is to share implementations between your public and internal APIs, by only exposing a subset of your graph publicly.

### [Install](https://pothos-graphql.dev/docs/plugins/sub-graph#install)

### [Setup](https://pothos-graphql.dev/docs/plugins/sub-graph#setup)

### [Options on Types](https://pothos-graphql.dev/docs/plugins/sub-graph#options-on-types)

- `subGraphs`: An optional array of sub-graph the type should be included in.

### [Object and Interface types:](https://pothos-graphql.dev/docs/plugins/sub-graph#object-and-interface-types)

- `defaultSubGraphsForFields`: Default sub-graph for fields of the type to be included in.

- `subGraphs`: An optional array of sub-graph the field to be included in. If not provided, will

fallback to:

    *   `defaultForFields` if set on type
    *   `subGraphs` of the type if `subGraphs.fieldsInheritFromTypes` was set in the builder
    *   an empty array

### [Options on Builder](https://pothos-graphql.dev/docs/plugins/sub-graph#options-on-builder)

- `subGraphs.defaultForTypes`: Specifies what sub-graph a type is part of by default.
- `subGraphs.fieldsInheritFromTypes`: defaults to `false`. When true, fields on a type will default to being part of the same sub-graph as their parent type. Only applies when type does not have `defaultForFields` set.

### [Usage](https://pothos-graphql.dev/docs/plugins/sub-graph#usage-1)

### [Missing types](https://pothos-graphql.dev/docs/plugins/sub-graph#missing-types)

When creating a sub-graph, the plugin will only copy in types that are included in the sub-graph, either by explicitly setting it on the type, or because the sub-graph is included in the default list. Like types, output fields that are not included in a sub-graph will also be omitted. Arguments and fields on Input types can not be removed because that would break assumptions about argument types in resolvers.

If a type that is not included in the sub-graph is referenced by another part of the graph that is included in the graph, a runtime error will be thrown when the sub graph is constructed. This can happen in a number of cases including cases where a removed type is used in the interfaces of an object, a member of a union, or the type of a field argument.

### [Explicitly including types](https://pothos-graphql.dev/docs/plugins/sub-graph#explicitly-including-types)

You can use the `explicitlyIncludeType` option to explicitly include types in a sub-graph that are unreachable. This isn't normally required, but there are some edge cases where this may be useful.

For instance, when extending external references with the federation plugin, the externalRef may not be reachable directly through your schema, but you may still want to include it when building the schema. To work around this, we can explicitly include any any types that have a `key` directive:

---

## URL: https://pothos-graphql.dev/docs/plugins/tracing

Title: Tracing plugin

URL Source: https://pothos-graphql.dev/docs/plugins/tracing

Markdown Content:
This plugin adds hooks for tracing and logging resolver invocations. It also comes with a few additional packages for integrating with various tracing providers including opentelemetry, New Relic and Sentry.

### [Install](https://pothos-graphql.dev/docs/plugins/tracing#install)

### [Setup](https://pothos-graphql.dev/docs/plugins/tracing#setup)

### [Overview](https://pothos-graphql.dev/docs/plugins/tracing#overview)

The Tracing plugin is designed to have very limited overhead, and uses a modular approach to cover a wide variety of use cases.

The tracing plugin comes with a number of utility functions for implementing common patterns, and a couple of provider specific modules that can be installed separately (described in more detail below).

The primary interface to the tracing plugin consists of 3 parts:

1.  A new `tracing` option is added to each field, for enabling or configuring tracing for that field
2.  The `tracing.default` which is used as a fallback for any field that does not explicitly set its `tracing` options.
3.  The `tracing.wrap` function, which takes a resolver, the tracing option for a field, and a field configuration object, and should return a wrapped/traced version of the resolver.

### [Enabling tracing for a field](https://pothos-graphql.dev/docs/plugins/tracing#enabling-tracing-for-a-field)

Enabling tracing on a field is as simple as setting the tracing option to `true`

#### [Custom tracing options](https://pothos-graphql.dev/docs/plugins/tracing#custom-tracing-options)

For more advanced tracing setups, you may want to allow fields to provide additional tracing options. You can do this by customizing the `Tracing` generic in the builder.

### [Enabling tracing by default](https://pothos-graphql.dev/docs/plugins/tracing#enabling-tracing-by-default)

In most applications you won't want to configure tracing for each field. Instead you can use the `tracing.default` to enable tracing for specific types of fields.

There are a number of utility functions for detecting certain types of fields. For most applications tracing every resolver will add significant overhead with very little benefit. The following utilities exported by the tracing plugin can be used to determine which fields should have tracing enabled by default.

- `isRootField`: Returns true for fields of the `Query`, `Mutation`, and `Subscription` types
- `isScalarField`: Returns true for fields that return Scalars, or lists of scalars
- `isEnumField`: Returns true for fields that return an Enum or list of Enums
- `isExposedField`: Returns true for fields defined with the `t.expose*` field builder methods, or fields that use the `defaultFieldResolver`.

### [Implementing a tracer](https://pothos-graphql.dev/docs/plugins/tracing#implementing-a-tracer)

Tracers work by wrapping the execution of resolver calls. The `tracing.wrap` function keeps this process as minimal as possible by simply providing the resolver for a field, and expecting a wrapped version of the resolver to be returned. Resolvers can throw errors or return promises, and correctly handling these edge cases can be a little complicated so the tracing plugin also comes with some helpers utilities to simplify this process.

`tracing.wrap` takes 3 arguments:

1.  `resolver`: the resolver for a field
2.  `options`: the tracing options for the field (set either on the field, or returned by `tracing.default`).
3.  `fieldConfig`: A config object that describes the field being wrapped

The `wrapResolver` utility takes a resolver, and a `onEnd` callback, and returns a wrapped version of the resolver that will call the callback with an error (or null) and the duration the resolver took to complete.

The `runFunction` helper is similar, but rather than wrapping a resolver, will immediately execute a function with no arguments. This can be useful for more complex use cases where you need access to other resolver arguments, or want to add your own logic before the resolver begins executing.

### [Using resolver arguments in tracers](https://pothos-graphql.dev/docs/plugins/tracing#using-resolver-arguments-in-tracers)

When defining tracing options for a field, you may want to pass some resolver args to your tracing logic.

The follow example shows how arguments might be passed to a tracer to be attached to a span:

The `default` option can also return a function to access resolver arguments:

It is important to know that if a field uses a function to return its tracing option (either directly on the field definition, or as a default) the behavior of the `wrap` function changes slightly.

By default `wrap` is called for each field when the schema is built. For fields that return their tracing option via a function, wrap will be called whenever the field is executed because the tracing options are dependent on the resolver arguments.

For many uses cases this does not add a lot of overhead, but as a rule of thumb, it is always more efficient to use tracing options that don't depend on the resolver value.

The above example could be re-designed slightly to improve tracing performance:

### [Opentelemetry](https://pothos-graphql.dev/docs/plugins/tracing#opentelemetry)

#### [install](https://pothos-graphql.dev/docs/plugins/tracing#install-1)

#### [Basic usage](https://pothos-graphql.dev/docs/plugins/tracing#basic-usage)

#### [options](https://pothos-graphql.dev/docs/plugins/tracing#options)

- `includeArgs`: default: `false`
- `includeSource`: default: `false`
- `ignoreError`: default: `false`
- `onSpan`: `(span, tracingOptions, parent, args, context, info) => void`

#### [Adding custom attributes to spans](https://pothos-graphql.dev/docs/plugins/tracing#adding-custom-attributes-to-spans)

#### [Instrumenting the execution phase](https://pothos-graphql.dev/docs/plugins/tracing#instrumenting-the-execution-phase)

The tracing plugin for Pothos only adds spans for resolvers. You may also want to capture additional information about other parts of the graphql execution process.

This example uses GraphQL Yoga, by providing a custom envelop plugin that wraps the execution phase. Many graphql server implementations have ways to wrap or replace the execution call, but will look slightly different.

Envelop also provides its own opentelemetry plugin which can be used instead of a custom plugin like the one shown above. The biggest drawback to this is the current version of `@envelop/opentelemetry` does not track the parent/child relations of spans it creates.

#### [Setting up a tracer](https://pothos-graphql.dev/docs/plugins/tracing#setting-up-a-tracer)

The following setup creates a very simple opentelemetry tracer that will log spans to the console. Real applications will need to define exporters that match the opentelemetry backend you are using.

### [Datadog](https://pothos-graphql.dev/docs/plugins/tracing#datadog)

Datadog supports opentelemetry. To report traces to datadog, you will need to instrument your application with an opentelemetry tracer, and configure your datadog agent to collect open telemetry traces.

#### [Creating a tracer that exports to datadog](https://pothos-graphql.dev/docs/plugins/tracing#creating-a-tracer-that-exports-to-datadog)

#### [Configuring the datadog agent to collect open telemetry](https://pothos-graphql.dev/docs/plugins/tracing#configuring-the-datadog-agent-to-collect-open-telemetry)

Add the following to your datadog agent configuration

### [New Relic](https://pothos-graphql.dev/docs/plugins/tracing#new-relic)

#### [install](https://pothos-graphql.dev/docs/plugins/tracing#install-2)

#### [Basic usage](https://pothos-graphql.dev/docs/plugins/tracing#basic-usage-1)

#### [options](https://pothos-graphql.dev/docs/plugins/tracing#options-1)

- `includeArgs`: default: `false`
- `includeSource`: default: `false`

#### [Instrumenting the execution phase](https://pothos-graphql.dev/docs/plugins/tracing#instrumenting-the-execution-phase-1)

The tracing plugin for Pothos only adds spans for resolvers. You may also want to capture additional information about other parts of the graphql execution process.

This example uses GraphQL Yoga, by providing a custom envelop plugin that wraps the execution phase. Many graphql server implementations have ways to wrap or replace the execution call, but will look slightly different.

### [Using the envelop newrelic plugin](https://pothos-graphql.dev/docs/plugins/tracing#using-the-envelop-newrelic-plugin)

Envelop has it's own plugin for newrelic that can be combined with the tracing plugin:

### [Sentry](https://pothos-graphql.dev/docs/plugins/tracing#sentry)

#### [install](https://pothos-graphql.dev/docs/plugins/tracing#install-3)

#### [Basic usage](https://pothos-graphql.dev/docs/plugins/tracing#basic-usage-2)

#### [options](https://pothos-graphql.dev/docs/plugins/tracing#options-2)

- `includeArgs`: default: `false`
- `includeSource`: default: `false`
- `ignoreError`: default: `false`

#### [Instrumenting the execution phase](https://pothos-graphql.dev/docs/plugins/tracing#instrumenting-the-execution-phase-2)

The tracing plugin for Pothos only adds spans for resolvers. You may also want to capture additional information about other parts of the graphql execution process.

This example uses GraphQL Yoga, by providing a custom envelop plugin that wraps the execution phase. Many graphql server implementations have ways to wrap or replace the execution call, but will look slightly different.

### [Using the envelop sentry plugin](https://pothos-graphql.dev/docs/plugins/tracing#using-the-envelop-sentry-plugin)

Envelop has it's own plugin for Sentry that can be combined with the tracing plugin:

### [AWS XRay](https://pothos-graphql.dev/docs/plugins/tracing#aws-xray)

#### [install](https://pothos-graphql.dev/docs/plugins/tracing#install-4)

#### [Basic usage](https://pothos-graphql.dev/docs/plugins/tracing#basic-usage-3)

#### [options](https://pothos-graphql.dev/docs/plugins/tracing#options-3)

- `includeArgs`: default: `false`
- `includeSource`: default: `false`

#### [Instrumenting the execution phase](https://pothos-graphql.dev/docs/plugins/tracing#instrumenting-the-execution-phase-3)

The tracing plugin for Pothos only adds spans for resolvers. You may also want to capture additional information about other parts of the graphql execution process.

This example uses GraphQL Yoga, by providing a custom envelop plugin that wraps the execution phase. Many graphql server implementations have ways to wrap or replace the execution call, but will look slightly different.

---

## URL: https://pothos-graphql.dev/docs/plugins/with-input

Title: With-Input plugin

URL Source: https://pothos-graphql.dev/docs/plugins/with-input

Markdown Content:
With-Input plugin

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 1: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Add GraphQL plugin](https://pothos-graphql.dev/docs/plugins/add-graphql)[Complexity plugin](https://pothos-graphql.dev/docs/plugins/complexity)[Dataloader plugin](https://pothos-graphql.dev/docs/plugins/dataloader)[Directive plugin](https://pothos-graphql.dev/docs/plugins/directives)[Drizzle plugin](https://pothos-graphql.dev/docs/plugins/drizzle)[Errors plugin](https://pothos-graphql.dev/docs/plugins/errors)[Federation plugin](https://pothos-graphql.dev/docs/plugins/federation)[Mocks plugin](https://pothos-graphql.dev/docs/plugins/mocks)[Relay plugin](https://pothos-graphql.dev/docs/plugins/relay)[Auth plugin](https://pothos-graphql.dev/docs/plugins/scope-auth)[Simple objects plugin](https://pothos-graphql.dev/docs/plugins/simple-objects)[Smart subscriptions plugin](https://pothos-graphql.dev/docs/plugins/smart-subscriptions)[SubGraph plugin](https://pothos-graphql.dev/docs/plugins/sub-graph)[Tracing plugin](https://pothos-graphql.dev/docs/plugins/tracing)[With-Input plugin](https://pothos-graphql.dev/docs/plugins/with-input)[Zod Validation plugin](https://pothos-graphql.dev/docs/plugins/zod)

[Prisma](https://pothos-graphql.dev/docs/plugins/prisma)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

With-Input plugin

[Plugins](https://pothos-graphql.dev/docs/plugins)

# With-Input plugin

A plugin for creating fields with a single input object. This plugin adds a new `t.fieldWithInput` method that allows you to more easily define fields with a single input type without having to define it separately.

## [Usage](https://pothos-graphql.dev/docs/plugins/with-input#usage)

### [Install](https://pothos-graphql.dev/docs/plugins/with-input#install)

npm pnpm yarn bun

`npm install --save @pothos/plugin-with-input`

### [Setup](https://pothos-graphql.dev/docs/plugins/with-input#setup)

```
import WithInputPlugin from '@pothos/plugin-with-input';
const builder = new SchemaBuilder({
  plugins: [WithInputPlugin],
  // optional
  withInput: {
    typeOptions: {
      // default options for Input object types created by this plugin
    },
    argOptions: {
      // set required: false to override default behavior
    },
  },
});
```

### [Defining fields with inputs](https://pothos-graphql.dev/docs/plugins/with-input#defining-fields-with-inputs)

```
builder.queryType({
  fields: (t) => ({
    example: t.fieldWithInput({
      input: {
        // Note that this uses a new t.input field builder for defining input fields
        id: t.input.id({ required: true }),
      },
      type: 'ID',
      resolve: (root, args) => args.input.id,
    }),
  }),
});
```

This will produce a schema like:

```
type Query {
  example(input: QueryExampleInput!): ID!
}

input QueryExampleInput {
  id: ID!
}
```

The input name will default to `${ParentType.name}${Field.name}Input`.

### [Customizing your input object](https://pothos-graphql.dev/docs/plugins/with-input#customizing-your-input-object)

You can customize the name of your Input object, and the name of the input argument:

```
builder.queryType({
  fields: (t) => ({
    example: t.fieldWithInput({
      typeOptions: {
        name: 'CustomInputTypeName',
        // Additional options for the input type can be added here
      },
      argOptions: {
        name: 'customArgName',
        // Additional options for the input argument can be added here
      },
      input: {
        id: t.input.id({ required: true }),
      },
      type: 'ID',
      // inputs are now under `customArgName`
      resolve: (root, args) => args.customArgName.id,
    }),
  }),
});
```

### [Changing the nullability of the input arg](https://pothos-graphql.dev/docs/plugins/with-input#changing-the-nullability-of-the-input-arg)

You can configure the global default for input args when creating the builder by providing `WithInputArgRequired` in the builders `SchemaTypes`, and setting `withInput.argOptions.required`.

```
const builder = new SchemaBuilder<{ WithInputArgRequired: false }>({
  plugins: [WithInputPlugin],
  withInput: {
    argOptions: {
      required: false,
    },
  },
});
```

arg requiredness can also be set on a per field basis by setting `argOptions.required`

```
builder.queryType({
  fields: (t) => ({
    example: t.fieldWithInput({
      type: 'Boolean',
      argOptions: {
        required: false,
      },
      input: {
        someInput: t.input.boolean({}),
      },
      resolve: (root, args) => {
        return args.input?.someInput;
      },
    }),
});
```

### [Prisma plugin integration](https://pothos-graphql.dev/docs/plugins/with-input#prisma-plugin-integration)

If you are using the prisma plugin you can use `t.prismaFieldWithInput` to add prisma fields with input objects:

```
builder.queryField('user', (t) =>
  t.prismaFieldWithInput({
    type: 'User',
    input: {
      id: t.input.id({ required: true }),
    },
    resolve: (query, _, args) =>
      prisma.user.findUnique({
        where: {
          id: Number.parseInt(args.input.id, 10),
        },
        ...query,
      }),
  }),
);
```

### [Customizing the default naming conventions](https://pothos-graphql.dev/docs/plugins/with-input#customizing-the-default-naming-conventions)

If you want to customize how the default input type names are generated you can provide a name callback in `withInput.typeOptions`:

```
import WithInputPlugin from '@pothos/plugin-with-input';
const builder = new SchemaBuilder({
  plugins: [WithInputPlugin],
  withInput: {
    typeOptions: {
      name: ({ parentTypeName, fieldName }) => {
        const capitalizedFieldName = `${fieldName[0].toUpperCase()}${fieldName.slice(1)}`;
        // This will remove the default Query/Mutation prefix from the input type name
        if (parentTypeName === 'Query' || parentTypeName === 'Mutation') {
          return `${capitalizedFieldName}Input`;
        }

        return `${parentTypeName}${capitalizedFieldName}Input`;
      },
    },
  },
});
```

[Tracing plugin A Pothos plugin for tracing and logging resolver invocations](https://pothos-graphql.dev/docs/plugins/tracing)[Zod Validation plugin Zod plugin docs for Pothos](https://pothos-graphql.dev/docs/plugins/zod)

### On this page

[Usage](https://pothos-graphql.dev/docs/plugins/with-input#usage)[Install](https://pothos-graphql.dev/docs/plugins/with-input#install)[Setup](https://pothos-graphql.dev/docs/plugins/with-input#setup)[Defining fields with inputs](https://pothos-graphql.dev/docs/plugins/with-input#defining-fields-with-inputs)[Customizing your input object](https://pothos-graphql.dev/docs/plugins/with-input#customizing-your-input-object)[Changing the nullability of the input arg](https://pothos-graphql.dev/docs/plugins/with-input#changing-the-nullability-of-the-input-arg)[Prisma plugin integration](https://pothos-graphql.dev/docs/plugins/with-input#prisma-plugin-integration)[Customizing the default naming conventions](https://pothos-graphql.dev/docs/plugins/with-input#customizing-the-default-naming-conventions)

---

## URL: https://pothos-graphql.dev/docs/plugins/zod

Title: Zod Validation plugin

URL Source: https://pothos-graphql.dev/docs/plugins/zod

Markdown Content:
A plugin for adding validation for field arguments based on [zod](https://github.com/colinhacks/zod). This plugin does not expose zod directly, but most of the options map closely to the validations available in zod.

### [Install](https://pothos-graphql.dev/docs/plugins/zod#install)

To use the zod plugin you will need to install both `zod` package and the zod plugin:

### [Setup](https://pothos-graphql.dev/docs/plugins/zod#setup)

`validationError`: (optional) A function that will be called when validation fails. The function will be passed the the zod validation error, as well as the args, context and info objects. It can throw an error, or return an error message or custom Error instance.

### [Examples](https://pothos-graphql.dev/docs/plugins/zod#examples)

#### [With custom message](https://pothos-graphql.dev/docs/plugins/zod#with-custom-message)

### [Validating List](https://pothos-graphql.dev/docs/plugins/zod#validating-list)

### [Using your own zod schemas](https://pothos-graphql.dev/docs/plugins/zod#using-your-own-zod-schemas)

If you just want to use a zod schema defined somewhere else, rather than using the validation options you can use the `schema` option:

You can also validate all arguments together using a zod schema:

### [On Object fields (for validating field arguments)](https://pothos-graphql.dev/docs/plugins/zod#on-object-fields-for-validating-field-arguments)

- `validate`: `Refinement<T>` | `Refinement<T>[]` | `ValidationOptions`.

### [On InputObjects (for validating all fields of an input object)](https://pothos-graphql.dev/docs/plugins/zod#on-inputobjects-for-validating-all-fields-of-an-input-object)

- `validate`: `Refinement<T>` | `Refinement<T>[]` | `ValidationOptions`.

### [On arguments or input object fields (for validating a specific input field or argument)](https://pothos-graphql.dev/docs/plugins/zod#on-arguments-or-input-object-fields-for-validating-a-specific-input-field-or-argument)

- `validate`: `Refinement<T>` | `Refinement<T>[]` | `ValidationOptions`.

### [`Refinement`](https://pothos-graphql.dev/docs/plugins/zod#refinement)

A `Refinement` is a function that will be passed to the ` zod``refine ` method. It receives the args object, input object, or value of the specific field the refinement is defined on. It should return a `boolean` or `Promise<boolean>`.

`Refinement`s can either be just a function: `(val) => isValid(val)`, or an array with the function, and an options object like: `[(val) => isValid(val), { message: 'field should be valid' }]`.

The options object may have a `message` property, and if the type being validated is an object, it can also include a `path` property with an array of strings indicating the path of the field in the object being validated. See the zod docs on `refine` for more details.

### [`ValidationOptions`](https://pothos-graphql.dev/docs/plugins/zod#validationoptions)

The validation options available depend on the type being validated. Each property of `ValidationOptions` can either be a value specific to the constraint, or an array with the value, and the options passed to the underlying zod method. This options object can be used to set a custom error message:

#### [Number](https://pothos-graphql.dev/docs/plugins/zod#number)

- `type`?: `'number'`
- `refine`?: `Refinement<number> | Refinement<number>[]`
- `min`?: `Constraint<number>`
- `max`?: `Constraint<number>`
- `positive`?: `Constraint<boolean>`
- `nonnegative`?: `Constraint<boolean>`
- `negative`?: `Constraint<boolean>`
- `nonpositive`?: `Constraint<boolean>`
- `int`?: `Constraint<boolean>`
- `schema`?: `ZodSchema<number>`

#### [BigInt](https://pothos-graphql.dev/docs/plugins/zod#bigint)

- `type`?: `'bigint'`
- `refine`?: `Refinement<bigint> | Refinement<bigint>[]`
- `schema`?: `ZodSchema<bigint>`

#### [Boolean](https://pothos-graphql.dev/docs/plugins/zod#boolean)

- `type`?: `'boolean'`
- `refine`?: `Refinement<boolean> | Refinement<boolean>[]`
- `schema`?: `ZodSchema<boolean>`

#### [Date](https://pothos-graphql.dev/docs/plugins/zod#date)

- `type`?: `'boolean'`
- `refine`?: `Refinement<boolean> | Refinement<boolean>[]`
- `schema`?: `ZodSchema<Date>`

#### [String](https://pothos-graphql.dev/docs/plugins/zod#string)

- `type`?: `'string'`;
- `refine`?: `Refinement<string> | Refinement<string>[]`
- `minLength`?: `Constraint<number>`
- `maxLength`?: `Constraint<number>`
- `length`?: `Constraint<number>`
- `url`?: `Constraint<boolean>`
- `uuid`?: `Constraint<boolean>`
- `email`?: `Constraint<boolean>`
- `regex`?: `Constraint<RegExp>`
- `schema`?: `ZodSchema<string>`

#### [Object](https://pothos-graphql.dev/docs/plugins/zod#object)

- `type`?: `'object'`;
- `refine`?: `Refinement<T> | Refinement<T>[]`
- `schema`?: `ZodSchema<Ts>`

#### [Array](https://pothos-graphql.dev/docs/plugins/zod#array)

- `type`?: `'array'`;
- `refine`?: `Refinement<T[]> | Refinement<T[]>[]`
- `minLength`?: `Constraint<number>`
- `maxLength`?: `Constraint<number>`
- `length`?: `Constraint<number>`
- `items`?: `ValidationOptions<T> | Refinement<T>`
- `schema`?: `ZodSchema<T[]>`

### [How it works](https://pothos-graphql.dev/docs/plugins/zod#how-it-works)

Each arg on an object field, and each field on an input type with validation will build its own zod validator. These validators will be a union of all potential types that can apply the validations defined for that field. For example, if you define an optional field with a `maxLength` validator, it will create a zod schema that looks something like:

If you set and `email` validation instead the schema might look like:

At runtime, we don't know anything about the types being used by your schema, we can't infer the expected js type from the type definition, so the best we can do is limit the valid types based on what validations they support. The `type` validation allows explicitly validating the `type` of a field to be one of the base types supported by zod:

There are a few exceptions the above:

1.  args and input fields that are `InputObject`s always use `zod.object()` rather than creating a union of potential types.

2.  args and input fields that are list types always use `zod.array()`.

3.  If you only include a `refine` validation (or just pass a function directly to validate) we will just use `zod`s unknown validator instead:

If the validation options include a `schema` that schema will be used as an intersection wit the generated validator:

### [Sharing schemas with client code](https://pothos-graphql.dev/docs/plugins/zod#sharing-schemas-with-client-code)

The easiest way to share validators is the use the to define schemas for your fields in an external file using the normal zod APIs, and then attaching those to your fields using the `schema` option.

You can also use the `createZodSchema` helper from the plugin directly to create zod Schemas from an options object:

---

## URL: https://pothos-graphql.dev/docs/migrations/v4#default-field-nullability

Title: v4.0

URL Source: https://pothos-graphql.dev/docs/migrations/v4

Markdown Content:
Migrating from Pothos 3.x to 4.0

The `4.0` release of Pothos is largely focused on updating 4 things:

1.  Improving outdated defaults to be more consistent and aligned with best practices
2.  Updating naming of some config options to be more consistent
3.  Updating minimum versions of peer dependencies
4.  Updating internal types to support some previously challenging plugin patterns

While the internals of Pothos have almost entirely been re-written, the public API surface should have a minimal changes for most users. The first 2 sets of changes will cover the majority of changes relevant to the majority of applications. To make the make the upgrade as simple as possible, some options were added to maintain the defaults and option names from `3.x` which are described in the simple upgrade section below.

- `typescript`: `5.0.2`
- `graphql`: `16.6.0`
- `node`: `18.0`

You can restore the 3.x defaults by adding the Defaults versions to both the SchemaTypes and the builder options:

This will restore all the defaults and config options from previous Pothos versions for both core and plugins.

If you are using `@pothos/plugin-validation`, it has been renamed to `@pothos/plugin-zod`, and a new validation plugin will be released in the future.

There are a number of new defaults and changes to options for various plugins. To fully upgrade to 4.0 see the full list of breaking changes below:

This section covers breaking API changes that can be automatically reverted by using the Simple Upgrade process described above.

Changes to types and classes outside the main Pothos API are described in the next section. Those changes will primarily affect other plugins and tools written for pothos, but may be relevant to some type helpers you have created.

### [Default field nullability](https://pothos-graphql.dev/docs/migrations/v4#default-field-nullability)

In previous versions of Pothos, fields were non-nullable by default. This is inconsistent with the rest of the GraphQL ecosystem, so the default is being changed to make fields nullable by default.

To restore the previous behavior you can set the `defaultFieldNullability` option when creating your builder:

Alternatively, fields can be updated to add `nullable: false` to the fields options.

### [Default ID Scalar types](https://pothos-graphql.dev/docs/migrations/v4#default-id-scalar-types)

The default types for the built in `ID` Scalar has been changed to more closely match the behavior of Javascript GraphQL server implementations:

This will make working with IDs in arguments and input types easier by avoiding unnecessary type checks to see if an `ID` is a `number` or `string`.

When returning an `ID` from a scalar you will be able to return a `string`, `number`, or `bigint`.

To restore the previous defaults you can customize the `ID` scalar types when creating your builder:

### [Renamed options](https://pothos-graphql.dev/docs/migrations/v4#renamed-options)

The base relay plugin options have moved from `relayOptions` to `relay` to be more consistent with options for other plugins.

### [New defaults](https://pothos-graphql.dev/docs/migrations/v4#new-defaults)

A number of the default values for relay options have changed:

- `clientMutationId`: Now defaults to `"omit"` and was previously `"required"`

  - `clientMutationId` was only required in early versions of the relay client, and is no-longer recommended.

- `cursorType`: Now defaults to `"String"` and was previously `"ID"`

  - The previous defaults were inconsistent about the type of a cursor. Cursors generally should not be treated as IDs as they are meant to indicate a position in a list, and may contain information specific to other filters or arguments applied to the connection.

- `brandLoadedObjects`: Now defaults to `true` and was previously `false`

  - This change will improve developer experience for most node implementations, as it removes the need for `isTypeOf` to be defined for most nodes.

- `edgesFieldOptions.nullable`: Now defaults to `{ list: options.defaultFieldNullability, items: true }` and was previously `{ list: false, items: true }`
- `nodeFieldOptions.nullable`: Now defaults to `options.defaultFieldNullability` and was previously `false`
  - This new default is intended to align with the relay connection spec, which does not expect connections to be NonNullable by default

To restore the previous defaults you can pass the old values when setting up the builder:

### [Nullable relations](https://pothos-graphql.dev/docs/migrations/v4#nullable-relations)

Previously the prisma would allow t.relation to define non-nullable fields using nullable relations. The plugin option now requires an `onNull` option to handle null relations on NonNullable fields

To restore the previous behavior you can set the `onNull` option to `'error'`, which will result in a runtime error when the field returns null

Alternatively you can mark the field as nullable:

`onNull` can also be set to a function that returns either a record matching the type of the relation, or a custom Error to throw when the relation is null.

`useGraphQLToolsUnorderedDirectives` has been nested inside a `directives` options object:

### [Renamed options](https://pothos-graphql.dev/docs/migrations/v4#renamed-options-1)

The base error plugin options have moved from `errorOptions` to `errors` to be more consistent with options for other plugins.

### [Renamed options](https://pothos-graphql.dev/docs/migrations/v4#renamed-options-2)

The base scope-auth plugin options have moved from `scopeAuthOptions` to `scopeAuth` to be more consistent with options for other plugins. The `authScopes` option has been moved to `scopeAuth.authScopes` to keep all options for the plugin in one options object.

### [Renamed options](https://pothos-graphql.dev/docs/migrations/v4#renamed-options-3)

The base validation plugin options have moved from `validationOptions` to `validation` to be more consistent with options for other plugins.

The `@pothos/plugin-authz` plugin has been removed, because the underlying `@graphql-authz/core` is not actively maintained, and has left critical security vulnerabilities unaddressed.

Unlike the defaults and config changes, the changes to the types and classes used throughout Pothos can't be easily made backwards compatibility with the 3.x releases. Below is a summary of the main changes made to the types and classes that may be used by plugins, helpers, or other libraries. Many of these types and classes are primarily intended for internal use, and should not affect most applications using pothos, but the changes are documented here to help upgrades for those of you building your own plugins, or using these types in your applications.

The 4.0 release is intended to allow pothos to become more modular and extensible. This requires Refs and many associated type helpers to propagate the SchemaTypes from the builder that originated them, meaning most of the changes listed below are adding `Types extends SchemaTypes` as the first generic argument to the type.

- `InputFieldBuilder`

  - Removed the `typename` argument from the constructor
  - Updated field methods to return a new `GenericInputRef`

- `InterfaceFieldBuilder`

  - Removed the `typename` argument from the constructor

- `ObjectFieldBuilder`

  - Removed the `typename` argument from the constructor

- `BaseTypeRef`

  - Added `SchemaTypes` as a new Generic parameter

- `EnumTypeRef`

  - Added `SchemaTypes` as a new Generic parameter

- `InputObjectRef`

  - Added `SchemaTypes` as a new Generic parameter

- `InputRef`

  - Added `SchemaTypes` as a new Generic parameter

- `OutputTypeRef`

  - Added `SchemaTypes` as a new Generic parameter

- `ListRef`

  - Added `SchemaTypes` as a new Generic parameter

- `InterfaceRef`

  - Added `SchemaTypes` as a new Generic parameter

- `ObjectRef`

  - Added `SchemaTypes` as a new Generic parameter

- `ScalarRef`

  - Added `SchemaTypes` as a new Generic parameter

- `UnionRef`

  - Added `SchemaTypes` as a new Generic parameter

- `FieldRef`

  - Added `SchemaTypes` as a new Generic parameter
  - removed the typename from constructor args
  - add the builder and Field options as arguments for the constructor

- `InputFieldRef`

  - Added `SchemaTypes` as a new Generic parameter
  - removed the typename and kind from constructor args
  - add the builder and Field options as arguments for the constructor
  - split argument refs into a new `ArgumentRef` class

- `*FieldThunk`

  - Updated to return a `GenericFieldRef<unknown>`

- `FieldMap`

  - Updated to `Record<string, GenericFieldRef<unknown>>;`

- `InputFieldMap`

  - Updated to `Record<string, GenericInputFieldRef<unknown>>;`

- `InputFieldsFromShape`

  - Added `SchemaTypes` as a new Generic parameter

- `InputShapeFromField`
  - Updated to accept a `GenericFieldRef`

The global interfaces for FieldOptions no-longer include the `resolve` option, which has moved to the `InferredFieldOptions` interface to allow plugins to replace or change the resolve functions types globally.

This means that when extending the `FieldOptionsByKind` interface, if you previously extended one of the built in Field option interfaces, you will need to update your types to include the `resolve` function types as well:

The `InferredFieldOptionsByKind` interface can be used to get the `resolve` option by default, but will also work for plugins that replace the `resolve` function with a different options for configuring how a field is resolved. Some custom object types may want to explicitly define a `resolve` option type, or omit it entirely (eg, the SimpleObject plugin does not use resolvers).

---

## URL: https://pothos-graphql.dev/docs/migrations/v4#default-id-scalar-types

Title: v4.0

URL Source: https://pothos-graphql.dev/docs/migrations/v4

Markdown Content:
Migrating from Pothos 3.x to 4.0

The `4.0` release of Pothos is largely focused on updating 4 things:

1.  Improving outdated defaults to be more consistent and aligned with best practices
2.  Updating naming of some config options to be more consistent
3.  Updating minimum versions of peer dependencies
4.  Updating internal types to support some previously challenging plugin patterns

While the internals of Pothos have almost entirely been re-written, the public API surface should have a minimal changes for most users. The first 2 sets of changes will cover the majority of changes relevant to the majority of applications. To make the make the upgrade as simple as possible, some options were added to maintain the defaults and option names from `3.x` which are described in the simple upgrade section below.

- `typescript`: `5.0.2`
- `graphql`: `16.6.0`
- `node`: `18.0`

You can restore the 3.x defaults by adding the Defaults versions to both the SchemaTypes and the builder options:

This will restore all the defaults and config options from previous Pothos versions for both core and plugins.

If you are using `@pothos/plugin-validation`, it has been renamed to `@pothos/plugin-zod`, and a new validation plugin will be released in the future.

There are a number of new defaults and changes to options for various plugins. To fully upgrade to 4.0 see the full list of breaking changes below:

This section covers breaking API changes that can be automatically reverted by using the Simple Upgrade process described above.

Changes to types and classes outside the main Pothos API are described in the next section. Those changes will primarily affect other plugins and tools written for pothos, but may be relevant to some type helpers you have created.

### [Default field nullability](https://pothos-graphql.dev/docs/migrations/v4#default-field-nullability)

In previous versions of Pothos, fields were non-nullable by default. This is inconsistent with the rest of the GraphQL ecosystem, so the default is being changed to make fields nullable by default.

To restore the previous behavior you can set the `defaultFieldNullability` option when creating your builder:

Alternatively, fields can be updated to add `nullable: false` to the fields options.

### [Default ID Scalar types](https://pothos-graphql.dev/docs/migrations/v4#default-id-scalar-types)

The default types for the built in `ID` Scalar has been changed to more closely match the behavior of Javascript GraphQL server implementations:

This will make working with IDs in arguments and input types easier by avoiding unnecessary type checks to see if an `ID` is a `number` or `string`.

When returning an `ID` from a scalar you will be able to return a `string`, `number`, or `bigint`.

To restore the previous defaults you can customize the `ID` scalar types when creating your builder:

### [Renamed options](https://pothos-graphql.dev/docs/migrations/v4#renamed-options)

The base relay plugin options have moved from `relayOptions` to `relay` to be more consistent with options for other plugins.

### [New defaults](https://pothos-graphql.dev/docs/migrations/v4#new-defaults)

A number of the default values for relay options have changed:

- `clientMutationId`: Now defaults to `"omit"` and was previously `"required"`

  - `clientMutationId` was only required in early versions of the relay client, and is no-longer recommended.

- `cursorType`: Now defaults to `"String"` and was previously `"ID"`

  - The previous defaults were inconsistent about the type of a cursor. Cursors generally should not be treated as IDs as they are meant to indicate a position in a list, and may contain information specific to other filters or arguments applied to the connection.

- `brandLoadedObjects`: Now defaults to `true` and was previously `false`

  - This change will improve developer experience for most node implementations, as it removes the need for `isTypeOf` to be defined for most nodes.

- `edgesFieldOptions.nullable`: Now defaults to `{ list: options.defaultFieldNullability, items: true }` and was previously `{ list: false, items: true }`
- `nodeFieldOptions.nullable`: Now defaults to `options.defaultFieldNullability` and was previously `false`
  - This new default is intended to align with the relay connection spec, which does not expect connections to be NonNullable by default

To restore the previous defaults you can pass the old values when setting up the builder:

### [Nullable relations](https://pothos-graphql.dev/docs/migrations/v4#nullable-relations)

Previously the prisma would allow t.relation to define non-nullable fields using nullable relations. The plugin option now requires an `onNull` option to handle null relations on NonNullable fields

To restore the previous behavior you can set the `onNull` option to `'error'`, which will result in a runtime error when the field returns null

Alternatively you can mark the field as nullable:

`onNull` can also be set to a function that returns either a record matching the type of the relation, or a custom Error to throw when the relation is null.

`useGraphQLToolsUnorderedDirectives` has been nested inside a `directives` options object:

### [Renamed options](https://pothos-graphql.dev/docs/migrations/v4#renamed-options-1)

The base error plugin options have moved from `errorOptions` to `errors` to be more consistent with options for other plugins.

### [Renamed options](https://pothos-graphql.dev/docs/migrations/v4#renamed-options-2)

The base scope-auth plugin options have moved from `scopeAuthOptions` to `scopeAuth` to be more consistent with options for other plugins. The `authScopes` option has been moved to `scopeAuth.authScopes` to keep all options for the plugin in one options object.

### [Renamed options](https://pothos-graphql.dev/docs/migrations/v4#renamed-options-3)

The base validation plugin options have moved from `validationOptions` to `validation` to be more consistent with options for other plugins.

The `@pothos/plugin-authz` plugin has been removed, because the underlying `@graphql-authz/core` is not actively maintained, and has left critical security vulnerabilities unaddressed.

Unlike the defaults and config changes, the changes to the types and classes used throughout Pothos can't be easily made backwards compatibility with the 3.x releases. Below is a summary of the main changes made to the types and classes that may be used by plugins, helpers, or other libraries. Many of these types and classes are primarily intended for internal use, and should not affect most applications using pothos, but the changes are documented here to help upgrades for those of you building your own plugins, or using these types in your applications.

The 4.0 release is intended to allow pothos to become more modular and extensible. This requires Refs and many associated type helpers to propagate the SchemaTypes from the builder that originated them, meaning most of the changes listed below are adding `Types extends SchemaTypes` as the first generic argument to the type.

- `InputFieldBuilder`

  - Removed the `typename` argument from the constructor
  - Updated field methods to return a new `GenericInputRef`

- `InterfaceFieldBuilder`

  - Removed the `typename` argument from the constructor

- `ObjectFieldBuilder`

  - Removed the `typename` argument from the constructor

- `BaseTypeRef`

  - Added `SchemaTypes` as a new Generic parameter

- `EnumTypeRef`

  - Added `SchemaTypes` as a new Generic parameter

- `InputObjectRef`

  - Added `SchemaTypes` as a new Generic parameter

- `InputRef`

  - Added `SchemaTypes` as a new Generic parameter

- `OutputTypeRef`

  - Added `SchemaTypes` as a new Generic parameter

- `ListRef`

  - Added `SchemaTypes` as a new Generic parameter

- `InterfaceRef`

  - Added `SchemaTypes` as a new Generic parameter

- `ObjectRef`

  - Added `SchemaTypes` as a new Generic parameter

- `ScalarRef`

  - Added `SchemaTypes` as a new Generic parameter

- `UnionRef`

  - Added `SchemaTypes` as a new Generic parameter

- `FieldRef`

  - Added `SchemaTypes` as a new Generic parameter
  - removed the typename from constructor args
  - add the builder and Field options as arguments for the constructor

- `InputFieldRef`

  - Added `SchemaTypes` as a new Generic parameter
  - removed the typename and kind from constructor args
  - add the builder and Field options as arguments for the constructor
  - split argument refs into a new `ArgumentRef` class

- `*FieldThunk`

  - Updated to return a `GenericFieldRef<unknown>`

- `FieldMap`

  - Updated to `Record<string, GenericFieldRef<unknown>>;`

- `InputFieldMap`

  - Updated to `Record<string, GenericInputFieldRef<unknown>>;`

- `InputFieldsFromShape`

  - Added `SchemaTypes` as a new Generic parameter

- `InputShapeFromField`
  - Updated to accept a `GenericFieldRef`

The global interfaces for FieldOptions no-longer include the `resolve` option, which has moved to the `InferredFieldOptions` interface to allow plugins to replace or change the resolve functions types globally.

This means that when extending the `FieldOptionsByKind` interface, if you previously extended one of the built in Field option interfaces, you will need to update your types to include the `resolve` function types as well:

The `InferredFieldOptionsByKind` interface can be used to get the `resolve` option by default, but will also work for plugins that replace the `resolve` function with a different options for configuring how a field is resolved. Some custom object types may want to explicitly define a `resolve` option type, or omit it entirely (eg, the SimpleObject plugin does not use resolvers).

---

## URL: https://pothos-graphql.dev/docs/migrations/v4#renamed-options

Title: v4.0

URL Source: https://pothos-graphql.dev/docs/migrations/v4

Markdown Content:
Migrating from Pothos 3.x to 4.0

The `4.0` release of Pothos is largely focused on updating 4 things:

1.  Improving outdated defaults to be more consistent and aligned with best practices
2.  Updating naming of some config options to be more consistent
3.  Updating minimum versions of peer dependencies
4.  Updating internal types to support some previously challenging plugin patterns

While the internals of Pothos have almost entirely been re-written, the public API surface should have a minimal changes for most users. The first 2 sets of changes will cover the majority of changes relevant to the majority of applications. To make the make the upgrade as simple as possible, some options were added to maintain the defaults and option names from `3.x` which are described in the simple upgrade section below.

- `typescript`: `5.0.2`
- `graphql`: `16.6.0`
- `node`: `18.0`

You can restore the 3.x defaults by adding the Defaults versions to both the SchemaTypes and the builder options:

This will restore all the defaults and config options from previous Pothos versions for both core and plugins.

If you are using `@pothos/plugin-validation`, it has been renamed to `@pothos/plugin-zod`, and a new validation plugin will be released in the future.

There are a number of new defaults and changes to options for various plugins. To fully upgrade to 4.0 see the full list of breaking changes below:

This section covers breaking API changes that can be automatically reverted by using the Simple Upgrade process described above.

Changes to types and classes outside the main Pothos API are described in the next section. Those changes will primarily affect other plugins and tools written for pothos, but may be relevant to some type helpers you have created.

### [Default field nullability](https://pothos-graphql.dev/docs/migrations/v4#default-field-nullability)

In previous versions of Pothos, fields were non-nullable by default. This is inconsistent with the rest of the GraphQL ecosystem, so the default is being changed to make fields nullable by default.

To restore the previous behavior you can set the `defaultFieldNullability` option when creating your builder:

Alternatively, fields can be updated to add `nullable: false` to the fields options.

### [Default ID Scalar types](https://pothos-graphql.dev/docs/migrations/v4#default-id-scalar-types)

The default types for the built in `ID` Scalar has been changed to more closely match the behavior of Javascript GraphQL server implementations:

This will make working with IDs in arguments and input types easier by avoiding unnecessary type checks to see if an `ID` is a `number` or `string`.

When returning an `ID` from a scalar you will be able to return a `string`, `number`, or `bigint`.

To restore the previous defaults you can customize the `ID` scalar types when creating your builder:

### [Renamed options](https://pothos-graphql.dev/docs/migrations/v4#renamed-options)

The base relay plugin options have moved from `relayOptions` to `relay` to be more consistent with options for other plugins.

### [New defaults](https://pothos-graphql.dev/docs/migrations/v4#new-defaults)

A number of the default values for relay options have changed:

- `clientMutationId`: Now defaults to `"omit"` and was previously `"required"`

  - `clientMutationId` was only required in early versions of the relay client, and is no-longer recommended.

- `cursorType`: Now defaults to `"String"` and was previously `"ID"`

  - The previous defaults were inconsistent about the type of a cursor. Cursors generally should not be treated as IDs as they are meant to indicate a position in a list, and may contain information specific to other filters or arguments applied to the connection.

- `brandLoadedObjects`: Now defaults to `true` and was previously `false`

  - This change will improve developer experience for most node implementations, as it removes the need for `isTypeOf` to be defined for most nodes.

- `edgesFieldOptions.nullable`: Now defaults to `{ list: options.defaultFieldNullability, items: true }` and was previously `{ list: false, items: true }`
- `nodeFieldOptions.nullable`: Now defaults to `options.defaultFieldNullability` and was previously `false`
  - This new default is intended to align with the relay connection spec, which does not expect connections to be NonNullable by default

To restore the previous defaults you can pass the old values when setting up the builder:

### [Nullable relations](https://pothos-graphql.dev/docs/migrations/v4#nullable-relations)

Previously the prisma would allow t.relation to define non-nullable fields using nullable relations. The plugin option now requires an `onNull` option to handle null relations on NonNullable fields

To restore the previous behavior you can set the `onNull` option to `'error'`, which will result in a runtime error when the field returns null

Alternatively you can mark the field as nullable:

`onNull` can also be set to a function that returns either a record matching the type of the relation, or a custom Error to throw when the relation is null.

`useGraphQLToolsUnorderedDirectives` has been nested inside a `directives` options object:

### [Renamed options](https://pothos-graphql.dev/docs/migrations/v4#renamed-options-1)

The base error plugin options have moved from `errorOptions` to `errors` to be more consistent with options for other plugins.

### [Renamed options](https://pothos-graphql.dev/docs/migrations/v4#renamed-options-2)

The base scope-auth plugin options have moved from `scopeAuthOptions` to `scopeAuth` to be more consistent with options for other plugins. The `authScopes` option has been moved to `scopeAuth.authScopes` to keep all options for the plugin in one options object.

### [Renamed options](https://pothos-graphql.dev/docs/migrations/v4#renamed-options-3)

The base validation plugin options have moved from `validationOptions` to `validation` to be more consistent with options for other plugins.

The `@pothos/plugin-authz` plugin has been removed, because the underlying `@graphql-authz/core` is not actively maintained, and has left critical security vulnerabilities unaddressed.

Unlike the defaults and config changes, the changes to the types and classes used throughout Pothos can't be easily made backwards compatibility with the 3.x releases. Below is a summary of the main changes made to the types and classes that may be used by plugins, helpers, or other libraries. Many of these types and classes are primarily intended for internal use, and should not affect most applications using pothos, but the changes are documented here to help upgrades for those of you building your own plugins, or using these types in your applications.

The 4.0 release is intended to allow pothos to become more modular and extensible. This requires Refs and many associated type helpers to propagate the SchemaTypes from the builder that originated them, meaning most of the changes listed below are adding `Types extends SchemaTypes` as the first generic argument to the type.

- `InputFieldBuilder`

  - Removed the `typename` argument from the constructor
  - Updated field methods to return a new `GenericInputRef`

- `InterfaceFieldBuilder`

  - Removed the `typename` argument from the constructor

- `ObjectFieldBuilder`

  - Removed the `typename` argument from the constructor

- `BaseTypeRef`

  - Added `SchemaTypes` as a new Generic parameter

- `EnumTypeRef`

  - Added `SchemaTypes` as a new Generic parameter

- `InputObjectRef`

  - Added `SchemaTypes` as a new Generic parameter

- `InputRef`

  - Added `SchemaTypes` as a new Generic parameter

- `OutputTypeRef`

  - Added `SchemaTypes` as a new Generic parameter

- `ListRef`

  - Added `SchemaTypes` as a new Generic parameter

- `InterfaceRef`

  - Added `SchemaTypes` as a new Generic parameter

- `ObjectRef`

  - Added `SchemaTypes` as a new Generic parameter

- `ScalarRef`

  - Added `SchemaTypes` as a new Generic parameter

- `UnionRef`

  - Added `SchemaTypes` as a new Generic parameter

- `FieldRef`

  - Added `SchemaTypes` as a new Generic parameter
  - removed the typename from constructor args
  - add the builder and Field options as arguments for the constructor

- `InputFieldRef`

  - Added `SchemaTypes` as a new Generic parameter
  - removed the typename and kind from constructor args
  - add the builder and Field options as arguments for the constructor
  - split argument refs into a new `ArgumentRef` class

- `*FieldThunk`

  - Updated to return a `GenericFieldRef<unknown>`

- `FieldMap`

  - Updated to `Record<string, GenericFieldRef<unknown>>;`

- `InputFieldMap`

  - Updated to `Record<string, GenericInputFieldRef<unknown>>;`

- `InputFieldsFromShape`

  - Added `SchemaTypes` as a new Generic parameter

- `InputShapeFromField`
  - Updated to accept a `GenericFieldRef`

The global interfaces for FieldOptions no-longer include the `resolve` option, which has moved to the `InferredFieldOptions` interface to allow plugins to replace or change the resolve functions types globally.

This means that when extending the `FieldOptionsByKind` interface, if you previously extended one of the built in Field option interfaces, you will need to update your types to include the `resolve` function types as well:

The `InferredFieldOptionsByKind` interface can be used to get the `resolve` option by default, but will also work for plugins that replace the `resolve` function with a different options for configuring how a field is resolved. Some custom object types may want to explicitly define a `resolve` option type, or omit it entirely (eg, the SimpleObject plugin does not use resolvers).

---

## URL: https://pothos-graphql.dev/docs/migrations/v4#new-defaults

Title: v4.0

URL Source: https://pothos-graphql.dev/docs/migrations/v4

Markdown Content:
Migrating from Pothos 3.x to 4.0

The `4.0` release of Pothos is largely focused on updating 4 things:

1.  Improving outdated defaults to be more consistent and aligned with best practices
2.  Updating naming of some config options to be more consistent
3.  Updating minimum versions of peer dependencies
4.  Updating internal types to support some previously challenging plugin patterns

While the internals of Pothos have almost entirely been re-written, the public API surface should have a minimal changes for most users. The first 2 sets of changes will cover the majority of changes relevant to the majority of applications. To make the make the upgrade as simple as possible, some options were added to maintain the defaults and option names from `3.x` which are described in the simple upgrade section below.

- `typescript`: `5.0.2`
- `graphql`: `16.6.0`
- `node`: `18.0`

You can restore the 3.x defaults by adding the Defaults versions to both the SchemaTypes and the builder options:

This will restore all the defaults and config options from previous Pothos versions for both core and plugins.

If you are using `@pothos/plugin-validation`, it has been renamed to `@pothos/plugin-zod`, and a new validation plugin will be released in the future.

There are a number of new defaults and changes to options for various plugins. To fully upgrade to 4.0 see the full list of breaking changes below:

This section covers breaking API changes that can be automatically reverted by using the Simple Upgrade process described above.

Changes to types and classes outside the main Pothos API are described in the next section. Those changes will primarily affect other plugins and tools written for pothos, but may be relevant to some type helpers you have created.

### [Default field nullability](https://pothos-graphql.dev/docs/migrations/v4#default-field-nullability)

In previous versions of Pothos, fields were non-nullable by default. This is inconsistent with the rest of the GraphQL ecosystem, so the default is being changed to make fields nullable by default.

To restore the previous behavior you can set the `defaultFieldNullability` option when creating your builder:

Alternatively, fields can be updated to add `nullable: false` to the fields options.

### [Default ID Scalar types](https://pothos-graphql.dev/docs/migrations/v4#default-id-scalar-types)

The default types for the built in `ID` Scalar has been changed to more closely match the behavior of Javascript GraphQL server implementations:

This will make working with IDs in arguments and input types easier by avoiding unnecessary type checks to see if an `ID` is a `number` or `string`.

When returning an `ID` from a scalar you will be able to return a `string`, `number`, or `bigint`.

To restore the previous defaults you can customize the `ID` scalar types when creating your builder:

### [Renamed options](https://pothos-graphql.dev/docs/migrations/v4#renamed-options)

The base relay plugin options have moved from `relayOptions` to `relay` to be more consistent with options for other plugins.

### [New defaults](https://pothos-graphql.dev/docs/migrations/v4#new-defaults)

A number of the default values for relay options have changed:

- `clientMutationId`: Now defaults to `"omit"` and was previously `"required"`

  - `clientMutationId` was only required in early versions of the relay client, and is no-longer recommended.

- `cursorType`: Now defaults to `"String"` and was previously `"ID"`

  - The previous defaults were inconsistent about the type of a cursor. Cursors generally should not be treated as IDs as they are meant to indicate a position in a list, and may contain information specific to other filters or arguments applied to the connection.

- `brandLoadedObjects`: Now defaults to `true` and was previously `false`

  - This change will improve developer experience for most node implementations, as it removes the need for `isTypeOf` to be defined for most nodes.

- `edgesFieldOptions.nullable`: Now defaults to `{ list: options.defaultFieldNullability, items: true }` and was previously `{ list: false, items: true }`
- `nodeFieldOptions.nullable`: Now defaults to `options.defaultFieldNullability` and was previously `false`
  - This new default is intended to align with the relay connection spec, which does not expect connections to be NonNullable by default

To restore the previous defaults you can pass the old values when setting up the builder:

### [Nullable relations](https://pothos-graphql.dev/docs/migrations/v4#nullable-relations)

Previously the prisma would allow t.relation to define non-nullable fields using nullable relations. The plugin option now requires an `onNull` option to handle null relations on NonNullable fields

To restore the previous behavior you can set the `onNull` option to `'error'`, which will result in a runtime error when the field returns null

Alternatively you can mark the field as nullable:

`onNull` can also be set to a function that returns either a record matching the type of the relation, or a custom Error to throw when the relation is null.

`useGraphQLToolsUnorderedDirectives` has been nested inside a `directives` options object:

### [Renamed options](https://pothos-graphql.dev/docs/migrations/v4#renamed-options-1)

The base error plugin options have moved from `errorOptions` to `errors` to be more consistent with options for other plugins.

### [Renamed options](https://pothos-graphql.dev/docs/migrations/v4#renamed-options-2)

The base scope-auth plugin options have moved from `scopeAuthOptions` to `scopeAuth` to be more consistent with options for other plugins. The `authScopes` option has been moved to `scopeAuth.authScopes` to keep all options for the plugin in one options object.

### [Renamed options](https://pothos-graphql.dev/docs/migrations/v4#renamed-options-3)

The base validation plugin options have moved from `validationOptions` to `validation` to be more consistent with options for other plugins.

The `@pothos/plugin-authz` plugin has been removed, because the underlying `@graphql-authz/core` is not actively maintained, and has left critical security vulnerabilities unaddressed.

Unlike the defaults and config changes, the changes to the types and classes used throughout Pothos can't be easily made backwards compatibility with the 3.x releases. Below is a summary of the main changes made to the types and classes that may be used by plugins, helpers, or other libraries. Many of these types and classes are primarily intended for internal use, and should not affect most applications using pothos, but the changes are documented here to help upgrades for those of you building your own plugins, or using these types in your applications.

The 4.0 release is intended to allow pothos to become more modular and extensible. This requires Refs and many associated type helpers to propagate the SchemaTypes from the builder that originated them, meaning most of the changes listed below are adding `Types extends SchemaTypes` as the first generic argument to the type.

- `InputFieldBuilder`

  - Removed the `typename` argument from the constructor
  - Updated field methods to return a new `GenericInputRef`

- `InterfaceFieldBuilder`

  - Removed the `typename` argument from the constructor

- `ObjectFieldBuilder`

  - Removed the `typename` argument from the constructor

- `BaseTypeRef`

  - Added `SchemaTypes` as a new Generic parameter

- `EnumTypeRef`

  - Added `SchemaTypes` as a new Generic parameter

- `InputObjectRef`

  - Added `SchemaTypes` as a new Generic parameter

- `InputRef`

  - Added `SchemaTypes` as a new Generic parameter

- `OutputTypeRef`

  - Added `SchemaTypes` as a new Generic parameter

- `ListRef`

  - Added `SchemaTypes` as a new Generic parameter

- `InterfaceRef`

  - Added `SchemaTypes` as a new Generic parameter

- `ObjectRef`

  - Added `SchemaTypes` as a new Generic parameter

- `ScalarRef`

  - Added `SchemaTypes` as a new Generic parameter

- `UnionRef`

  - Added `SchemaTypes` as a new Generic parameter

- `FieldRef`

  - Added `SchemaTypes` as a new Generic parameter
  - removed the typename from constructor args
  - add the builder and Field options as arguments for the constructor

- `InputFieldRef`

  - Added `SchemaTypes` as a new Generic parameter
  - removed the typename and kind from constructor args
  - add the builder and Field options as arguments for the constructor
  - split argument refs into a new `ArgumentRef` class

- `*FieldThunk`

  - Updated to return a `GenericFieldRef<unknown>`

- `FieldMap`

  - Updated to `Record<string, GenericFieldRef<unknown>>;`

- `InputFieldMap`

  - Updated to `Record<string, GenericInputFieldRef<unknown>>;`

- `InputFieldsFromShape`

  - Added `SchemaTypes` as a new Generic parameter

- `InputShapeFromField`
  - Updated to accept a `GenericFieldRef`

The global interfaces for FieldOptions no-longer include the `resolve` option, which has moved to the `InferredFieldOptions` interface to allow plugins to replace or change the resolve functions types globally.

This means that when extending the `FieldOptionsByKind` interface, if you previously extended one of the built in Field option interfaces, you will need to update your types to include the `resolve` function types as well:

The `InferredFieldOptionsByKind` interface can be used to get the `resolve` option by default, but will also work for plugins that replace the `resolve` function with a different options for configuring how a field is resolved. Some custom object types may want to explicitly define a `resolve` option type, or omit it entirely (eg, the SimpleObject plugin does not use resolvers).

---

## URL: https://pothos-graphql.dev/docs/migrations/v4#nullable-relations

Title: v4.0

URL Source: https://pothos-graphql.dev/docs/migrations/v4

Markdown Content:
Migrating from Pothos 3.x to 4.0

The `4.0` release of Pothos is largely focused on updating 4 things:

1.  Improving outdated defaults to be more consistent and aligned with best practices
2.  Updating naming of some config options to be more consistent
3.  Updating minimum versions of peer dependencies
4.  Updating internal types to support some previously challenging plugin patterns

While the internals of Pothos have almost entirely been re-written, the public API surface should have a minimal changes for most users. The first 2 sets of changes will cover the majority of changes relevant to the majority of applications. To make the make the upgrade as simple as possible, some options were added to maintain the defaults and option names from `3.x` which are described in the simple upgrade section below.

- `typescript`: `5.0.2`
- `graphql`: `16.6.0`
- `node`: `18.0`

You can restore the 3.x defaults by adding the Defaults versions to both the SchemaTypes and the builder options:

This will restore all the defaults and config options from previous Pothos versions for both core and plugins.

If you are using `@pothos/plugin-validation`, it has been renamed to `@pothos/plugin-zod`, and a new validation plugin will be released in the future.

There are a number of new defaults and changes to options for various plugins. To fully upgrade to 4.0 see the full list of breaking changes below:

This section covers breaking API changes that can be automatically reverted by using the Simple Upgrade process described above.

Changes to types and classes outside the main Pothos API are described in the next section. Those changes will primarily affect other plugins and tools written for pothos, but may be relevant to some type helpers you have created.

### [Default field nullability](https://pothos-graphql.dev/docs/migrations/v4#default-field-nullability)

In previous versions of Pothos, fields were non-nullable by default. This is inconsistent with the rest of the GraphQL ecosystem, so the default is being changed to make fields nullable by default.

To restore the previous behavior you can set the `defaultFieldNullability` option when creating your builder:

Alternatively, fields can be updated to add `nullable: false` to the fields options.

### [Default ID Scalar types](https://pothos-graphql.dev/docs/migrations/v4#default-id-scalar-types)

The default types for the built in `ID` Scalar has been changed to more closely match the behavior of Javascript GraphQL server implementations:

This will make working with IDs in arguments and input types easier by avoiding unnecessary type checks to see if an `ID` is a `number` or `string`.

When returning an `ID` from a scalar you will be able to return a `string`, `number`, or `bigint`.

To restore the previous defaults you can customize the `ID` scalar types when creating your builder:

### [Renamed options](https://pothos-graphql.dev/docs/migrations/v4#renamed-options)

The base relay plugin options have moved from `relayOptions` to `relay` to be more consistent with options for other plugins.

### [New defaults](https://pothos-graphql.dev/docs/migrations/v4#new-defaults)

A number of the default values for relay options have changed:

- `clientMutationId`: Now defaults to `"omit"` and was previously `"required"`

  - `clientMutationId` was only required in early versions of the relay client, and is no-longer recommended.

- `cursorType`: Now defaults to `"String"` and was previously `"ID"`

  - The previous defaults were inconsistent about the type of a cursor. Cursors generally should not be treated as IDs as they are meant to indicate a position in a list, and may contain information specific to other filters or arguments applied to the connection.

- `brandLoadedObjects`: Now defaults to `true` and was previously `false`

  - This change will improve developer experience for most node implementations, as it removes the need for `isTypeOf` to be defined for most nodes.

- `edgesFieldOptions.nullable`: Now defaults to `{ list: options.defaultFieldNullability, items: true }` and was previously `{ list: false, items: true }`
- `nodeFieldOptions.nullable`: Now defaults to `options.defaultFieldNullability` and was previously `false`
  - This new default is intended to align with the relay connection spec, which does not expect connections to be NonNullable by default

To restore the previous defaults you can pass the old values when setting up the builder:

### [Nullable relations](https://pothos-graphql.dev/docs/migrations/v4#nullable-relations)

Previously the prisma would allow t.relation to define non-nullable fields using nullable relations. The plugin option now requires an `onNull` option to handle null relations on NonNullable fields

To restore the previous behavior you can set the `onNull` option to `'error'`, which will result in a runtime error when the field returns null

Alternatively you can mark the field as nullable:

`onNull` can also be set to a function that returns either a record matching the type of the relation, or a custom Error to throw when the relation is null.

`useGraphQLToolsUnorderedDirectives` has been nested inside a `directives` options object:

### [Renamed options](https://pothos-graphql.dev/docs/migrations/v4#renamed-options-1)

The base error plugin options have moved from `errorOptions` to `errors` to be more consistent with options for other plugins.

### [Renamed options](https://pothos-graphql.dev/docs/migrations/v4#renamed-options-2)

The base scope-auth plugin options have moved from `scopeAuthOptions` to `scopeAuth` to be more consistent with options for other plugins. The `authScopes` option has been moved to `scopeAuth.authScopes` to keep all options for the plugin in one options object.

### [Renamed options](https://pothos-graphql.dev/docs/migrations/v4#renamed-options-3)

The base validation plugin options have moved from `validationOptions` to `validation` to be more consistent with options for other plugins.

The `@pothos/plugin-authz` plugin has been removed, because the underlying `@graphql-authz/core` is not actively maintained, and has left critical security vulnerabilities unaddressed.

Unlike the defaults and config changes, the changes to the types and classes used throughout Pothos can't be easily made backwards compatibility with the 3.x releases. Below is a summary of the main changes made to the types and classes that may be used by plugins, helpers, or other libraries. Many of these types and classes are primarily intended for internal use, and should not affect most applications using pothos, but the changes are documented here to help upgrades for those of you building your own plugins, or using these types in your applications.

The 4.0 release is intended to allow pothos to become more modular and extensible. This requires Refs and many associated type helpers to propagate the SchemaTypes from the builder that originated them, meaning most of the changes listed below are adding `Types extends SchemaTypes` as the first generic argument to the type.

- `InputFieldBuilder`

  - Removed the `typename` argument from the constructor
  - Updated field methods to return a new `GenericInputRef`

- `InterfaceFieldBuilder`

  - Removed the `typename` argument from the constructor

- `ObjectFieldBuilder`

  - Removed the `typename` argument from the constructor

- `BaseTypeRef`

  - Added `SchemaTypes` as a new Generic parameter

- `EnumTypeRef`

  - Added `SchemaTypes` as a new Generic parameter

- `InputObjectRef`

  - Added `SchemaTypes` as a new Generic parameter

- `InputRef`

  - Added `SchemaTypes` as a new Generic parameter

- `OutputTypeRef`

  - Added `SchemaTypes` as a new Generic parameter

- `ListRef`

  - Added `SchemaTypes` as a new Generic parameter

- `InterfaceRef`

  - Added `SchemaTypes` as a new Generic parameter

- `ObjectRef`

  - Added `SchemaTypes` as a new Generic parameter

- `ScalarRef`

  - Added `SchemaTypes` as a new Generic parameter

- `UnionRef`

  - Added `SchemaTypes` as a new Generic parameter

- `FieldRef`

  - Added `SchemaTypes` as a new Generic parameter
  - removed the typename from constructor args
  - add the builder and Field options as arguments for the constructor

- `InputFieldRef`

  - Added `SchemaTypes` as a new Generic parameter
  - removed the typename and kind from constructor args
  - add the builder and Field options as arguments for the constructor
  - split argument refs into a new `ArgumentRef` class

- `*FieldThunk`

  - Updated to return a `GenericFieldRef<unknown>`

- `FieldMap`

  - Updated to `Record<string, GenericFieldRef<unknown>>;`

- `InputFieldMap`

  - Updated to `Record<string, GenericInputFieldRef<unknown>>;`

- `InputFieldsFromShape`

  - Added `SchemaTypes` as a new Generic parameter

- `InputShapeFromField`
  - Updated to accept a `GenericFieldRef`

The global interfaces for FieldOptions no-longer include the `resolve` option, which has moved to the `InferredFieldOptions` interface to allow plugins to replace or change the resolve functions types globally.

This means that when extending the `FieldOptionsByKind` interface, if you previously extended one of the built in Field option interfaces, you will need to update your types to include the `resolve` function types as well:

The `InferredFieldOptionsByKind` interface can be used to get the `resolve` option by default, but will also work for plugins that replace the `resolve` function with a different options for configuring how a field is resolved. Some custom object types may want to explicitly define a `resolve` option type, or omit it entirely (eg, the SimpleObject plugin does not use resolvers).

---

## URL: https://pothos-graphql.dev/docs/migrations/v4#renamed-options-1

Title: v4.0

URL Source: https://pothos-graphql.dev/docs/migrations/v4

Markdown Content:
Migrating from Pothos 3.x to 4.0

The `4.0` release of Pothos is largely focused on updating 4 things:

1.  Improving outdated defaults to be more consistent and aligned with best practices
2.  Updating naming of some config options to be more consistent
3.  Updating minimum versions of peer dependencies
4.  Updating internal types to support some previously challenging plugin patterns

While the internals of Pothos have almost entirely been re-written, the public API surface should have a minimal changes for most users. The first 2 sets of changes will cover the majority of changes relevant to the majority of applications. To make the make the upgrade as simple as possible, some options were added to maintain the defaults and option names from `3.x` which are described in the simple upgrade section below.

- `typescript`: `5.0.2`
- `graphql`: `16.6.0`
- `node`: `18.0`

You can restore the 3.x defaults by adding the Defaults versions to both the SchemaTypes and the builder options:

This will restore all the defaults and config options from previous Pothos versions for both core and plugins.

If you are using `@pothos/plugin-validation`, it has been renamed to `@pothos/plugin-zod`, and a new validation plugin will be released in the future.

There are a number of new defaults and changes to options for various plugins. To fully upgrade to 4.0 see the full list of breaking changes below:

This section covers breaking API changes that can be automatically reverted by using the Simple Upgrade process described above.

Changes to types and classes outside the main Pothos API are described in the next section. Those changes will primarily affect other plugins and tools written for pothos, but may be relevant to some type helpers you have created.

### [Default field nullability](https://pothos-graphql.dev/docs/migrations/v4#default-field-nullability)

In previous versions of Pothos, fields were non-nullable by default. This is inconsistent with the rest of the GraphQL ecosystem, so the default is being changed to make fields nullable by default.

To restore the previous behavior you can set the `defaultFieldNullability` option when creating your builder:

Alternatively, fields can be updated to add `nullable: false` to the fields options.

### [Default ID Scalar types](https://pothos-graphql.dev/docs/migrations/v4#default-id-scalar-types)

The default types for the built in `ID` Scalar has been changed to more closely match the behavior of Javascript GraphQL server implementations:

This will make working with IDs in arguments and input types easier by avoiding unnecessary type checks to see if an `ID` is a `number` or `string`.

When returning an `ID` from a scalar you will be able to return a `string`, `number`, or `bigint`.

To restore the previous defaults you can customize the `ID` scalar types when creating your builder:

### [Renamed options](https://pothos-graphql.dev/docs/migrations/v4#renamed-options)

The base relay plugin options have moved from `relayOptions` to `relay` to be more consistent with options for other plugins.

### [New defaults](https://pothos-graphql.dev/docs/migrations/v4#new-defaults)

A number of the default values for relay options have changed:

- `clientMutationId`: Now defaults to `"omit"` and was previously `"required"`

  - `clientMutationId` was only required in early versions of the relay client, and is no-longer recommended.

- `cursorType`: Now defaults to `"String"` and was previously `"ID"`

  - The previous defaults were inconsistent about the type of a cursor. Cursors generally should not be treated as IDs as they are meant to indicate a position in a list, and may contain information specific to other filters or arguments applied to the connection.

- `brandLoadedObjects`: Now defaults to `true` and was previously `false`

  - This change will improve developer experience for most node implementations, as it removes the need for `isTypeOf` to be defined for most nodes.

- `edgesFieldOptions.nullable`: Now defaults to `{ list: options.defaultFieldNullability, items: true }` and was previously `{ list: false, items: true }`
- `nodeFieldOptions.nullable`: Now defaults to `options.defaultFieldNullability` and was previously `false`
  - This new default is intended to align with the relay connection spec, which does not expect connections to be NonNullable by default

To restore the previous defaults you can pass the old values when setting up the builder:

### [Nullable relations](https://pothos-graphql.dev/docs/migrations/v4#nullable-relations)

Previously the prisma would allow t.relation to define non-nullable fields using nullable relations. The plugin option now requires an `onNull` option to handle null relations on NonNullable fields

To restore the previous behavior you can set the `onNull` option to `'error'`, which will result in a runtime error when the field returns null

Alternatively you can mark the field as nullable:

`onNull` can also be set to a function that returns either a record matching the type of the relation, or a custom Error to throw when the relation is null.

`useGraphQLToolsUnorderedDirectives` has been nested inside a `directives` options object:

### [Renamed options](https://pothos-graphql.dev/docs/migrations/v4#renamed-options-1)

The base error plugin options have moved from `errorOptions` to `errors` to be more consistent with options for other plugins.

### [Renamed options](https://pothos-graphql.dev/docs/migrations/v4#renamed-options-2)

The base scope-auth plugin options have moved from `scopeAuthOptions` to `scopeAuth` to be more consistent with options for other plugins. The `authScopes` option has been moved to `scopeAuth.authScopes` to keep all options for the plugin in one options object.

### [Renamed options](https://pothos-graphql.dev/docs/migrations/v4#renamed-options-3)

The base validation plugin options have moved from `validationOptions` to `validation` to be more consistent with options for other plugins.

The `@pothos/plugin-authz` plugin has been removed, because the underlying `@graphql-authz/core` is not actively maintained, and has left critical security vulnerabilities unaddressed.

Unlike the defaults and config changes, the changes to the types and classes used throughout Pothos can't be easily made backwards compatibility with the 3.x releases. Below is a summary of the main changes made to the types and classes that may be used by plugins, helpers, or other libraries. Many of these types and classes are primarily intended for internal use, and should not affect most applications using pothos, but the changes are documented here to help upgrades for those of you building your own plugins, or using these types in your applications.

The 4.0 release is intended to allow pothos to become more modular and extensible. This requires Refs and many associated type helpers to propagate the SchemaTypes from the builder that originated them, meaning most of the changes listed below are adding `Types extends SchemaTypes` as the first generic argument to the type.

- `InputFieldBuilder`

  - Removed the `typename` argument from the constructor
  - Updated field methods to return a new `GenericInputRef`

- `InterfaceFieldBuilder`

  - Removed the `typename` argument from the constructor

- `ObjectFieldBuilder`

  - Removed the `typename` argument from the constructor

- `BaseTypeRef`

  - Added `SchemaTypes` as a new Generic parameter

- `EnumTypeRef`

  - Added `SchemaTypes` as a new Generic parameter

- `InputObjectRef`

  - Added `SchemaTypes` as a new Generic parameter

- `InputRef`

  - Added `SchemaTypes` as a new Generic parameter

- `OutputTypeRef`

  - Added `SchemaTypes` as a new Generic parameter

- `ListRef`

  - Added `SchemaTypes` as a new Generic parameter

- `InterfaceRef`

  - Added `SchemaTypes` as a new Generic parameter

- `ObjectRef`

  - Added `SchemaTypes` as a new Generic parameter

- `ScalarRef`

  - Added `SchemaTypes` as a new Generic parameter

- `UnionRef`

  - Added `SchemaTypes` as a new Generic parameter

- `FieldRef`

  - Added `SchemaTypes` as a new Generic parameter
  - removed the typename from constructor args
  - add the builder and Field options as arguments for the constructor

- `InputFieldRef`

  - Added `SchemaTypes` as a new Generic parameter
  - removed the typename and kind from constructor args
  - add the builder and Field options as arguments for the constructor
  - split argument refs into a new `ArgumentRef` class

- `*FieldThunk`

  - Updated to return a `GenericFieldRef<unknown>`

- `FieldMap`

  - Updated to `Record<string, GenericFieldRef<unknown>>;`

- `InputFieldMap`

  - Updated to `Record<string, GenericInputFieldRef<unknown>>;`

- `InputFieldsFromShape`

  - Added `SchemaTypes` as a new Generic parameter

- `InputShapeFromField`
  - Updated to accept a `GenericFieldRef`

The global interfaces for FieldOptions no-longer include the `resolve` option, which has moved to the `InferredFieldOptions` interface to allow plugins to replace or change the resolve functions types globally.

This means that when extending the `FieldOptionsByKind` interface, if you previously extended one of the built in Field option interfaces, you will need to update your types to include the `resolve` function types as well:

The `InferredFieldOptionsByKind` interface can be used to get the `resolve` option by default, but will also work for plugins that replace the `resolve` function with a different options for configuring how a field is resolved. Some custom object types may want to explicitly define a `resolve` option type, or omit it entirely (eg, the SimpleObject plugin does not use resolvers).

---

## URL: https://pothos-graphql.dev/docs#hello-world

Title: Overview

URL Source: https://pothos-graphql.dev/docs

Markdown Content:
Overview

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 3: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

Overview Hello, World

# Overview

![Image 4: Pothos](https://pothos-graphql.dev/_next/static/media/logo-name-auto.893a025d.svg)

Pothos is a plugin based GraphQL schema builder for typescript.

It makes building graphql schemas in typescript easy, fast and enjoyable. The core of Pothos adds 0 overhead at runtime, and has `graphql` as its only dependency.

Pothos is the most type-safe way to build GraphQL schemas in typescript, and by leveraging type inference and typescript's powerful type system Pothos requires very few manual type definitions and no code generation.

Pothos has a unique and powerful plugin system that makes every plugin feel like its features are built into the core library. Plugins can extend almost any part of the API by adding new options or methods that can take full advantage of the Pothos type system.

## [Hello, World](https://pothos-graphql.dev/docs#hello-world)

```
import { createYoga } from 'graphql-yoga';
import { createServer } from 'node:http';
import SchemaBuilder from '@pothos/core';

const builder = new SchemaBuilder({});

builder.queryType({
  fields: (t) => ({
    hello: t.string({
      args: {
        name: t.arg.string(),
      },
      resolve: (parent, { name }) => `hello, ${name || 'World'}`,
    }),
  }),
});

const yoga = createYoga({
  schema: builder.toSchema(),
});

const server = createServer(yoga);

server.listen(3000, () => {
  console.log('Visit http://localhost:3000/graphql');
});
```

## [What sets Pothos apart](https://pothos-graphql.dev/docs#what-sets-pothos-apart)

- Pothos was built from the start to leverage typescript for best-in-class type-safety.
- Pothos has a clear separation between the shape of your external GraphQL API, and the internal representation of your data.
- Pothos comes with a large plugin ecosystem that provides a wide variety of features while maintaining great interoperability between plugins.
- Pothos does not depend on code-generation or experimental decorators for type-safety.
- Pothos has been designed to work at every scale from small prototypes to huge Enterprise applications, and is in use at some of the largest tech companies including Airbnb and Netflix.

## [Plugins that make Pothos even better](https://pothos-graphql.dev/docs#plugins-that-make-pothos-even-better)

[### Add GraphQL Add existing GraphQL types to your schema](https://pothos-graphql.dev/docs/plugins/add-graphql)[### Auth Add global, type level, or field level authorization checks to your schema](https://pothos-graphql.dev/docs/plugins/scope-auth)[### Complexity A plugin for defining and limiting complexity of queries](https://pothos-graphql.dev/docs/plugins/complexity)[### Dataloader Quickly define data-loaders for your types and fields to avoid n+1 queries.](https://pothos-graphql.dev/docs/plugins/dataloader)[### Directives Integrate with existing schema graphql directives in a type-safe way.](https://pothos-graphql.dev/docs/plugins/directives)[### Drizzle A plugin to support efficient queries through drizzles relational query builder API](https://pothos-graphql.dev/docs/plugins/drizzle)[### Errors A plugin for easily including error types in your GraphQL schema and hooking up error types to resolvers.](https://pothos-graphql.dev/docs/plugins/errors)[### Mocks Add mock resolvers for easier testing](https://pothos-graphql.dev/docs/plugins/mocks)[### Prisma A plugin for more efficient integration with prisma that can help solve n+1 issues and more efficiently resolve queries](https://pothos-graphql.dev/docs/plugins/prisma)[### Relay Easy to use builder methods for defining relay style nodes and connections, and helpful utilities for cursor based pagination.](https://pothos-graphql.dev/docs/plugins/relay)[### Simple Objects Define simple object types without resolvers or manual type definitions.](https://pothos-graphql.dev/docs/plugins/simple-objects)[### Smart Subscriptions Make any part of your graph subscribable to get live updates as your data changes.](https://pothos-graphql.dev/docs/plugins/smart-subscriptions)[### Sub-Graph Build multiple subsets of your graph to easily share code between internal and external APIs.](https://pothos-graphql.dev/docs/plugins/sub-graph)[### Tracing Add tracing for resolver execution, with support for opentelemetry, newrelic, century, logging, and custom tracers](https://pothos-graphql.dev/docs/plugins/tracing)[### With-Input Define fields with inline input objects](https://pothos-graphql.dev/docs/plugins/with-input)[### Zod Validation Validating your inputs and arguments](https://pothos-graphql.dev/docs/plugins/zod)

[Sponsors The generous people supporting Pothos development](https://pothos-graphql.dev/docs/sponsors)

### On this page

[Hello, World](https://pothos-graphql.dev/docs#hello-world)[What sets Pothos apart](https://pothos-graphql.dev/docs#what-sets-pothos-apart)[Plugins that make Pothos even better](https://pothos-graphql.dev/docs#plugins-that-make-pothos-even-better)

---

## URL: https://pothos-graphql.dev/docs/resources#3rd-party-tools-and-libraries

Title: Resources

URL Source: https://pothos-graphql.dev/docs/resources

Markdown Content:
Resources

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 1: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

Resources Guides and Tutorials

# Resources

## [Guides and Tutorials](https://pothos-graphql.dev/docs/resources#guides-and-tutorials)

- [End-To-End Type-Safety with GraphQL, Prisma & React: GraphQL API](https://www.prisma.io/blog/e2e-type-safety-graphql-react-3-fbV2ZVIGWg#start-up-a-graphql-server) by [Sabin Adams](https://twitter.com/sabinthedev)
- [Code-first GraphQL with Pothos](https://graphql.wtf/episodes/60-code-first-graphql-with-pothos) by [Jamie Barton](https://twitter.com/notrab)
- [How to Build a Type-safe GraphQL API using Pothos and Kysely](https://dev.to/franciscomendes10866/how-to-build-a-type-safe-graphql-api-using-pothos-and-kysely-4ja3) by [Francisco Mendes](https://github.com/FranciscoMendes10866)
- [Type-safe GraphQL Server with Pothos](https://omkarkulkarni.hashnode.dev/type-safe-graphql-server-with-pothos-formerly-giraphql) by [Omkar Kulkarni](https://twitter.com/omkar_k45)
- [Build a GraphQL server running on Cloudflare Workers](https://the-guild.dev/blog/graphql-yoga-worker) by [Rito Tamata](https://twitter.com/chimame_rt)

## [3rd party Tools and Libraries](https://pothos-graphql.dev/docs/resources#3rd-party-tools-and-libraries)

- [Prisma Generator Pothos Codegen](https://github.com/Cauen/prisma-generator-pothos-codegen) by [Emanuel](https://twitter.com/cauenor)
- [Nexus to Pothos codemod](https://github.com/villesau/nexus-to-pothos-codemod) by [Ville Saukkonen](https://twitter.com/SaukkonenVille)
- [protoc-gen-pothos](https://github.com/proto-graphql/proto-graphql-js/tree/main/packages/protoc-gen-pothos) by [Masayuki Izumi](https://twitter.com/izumin5210)
- [@smatch-corp/nestjs-pothos](https://github.com/smatch-corp/nestjs-pothos) by [Chanhee Lee](https://github.com/iamchanii)
- [pothos-protoc-gen](https://iamchanii.github.io/pothos-protoc-gen/) by [Chanhee Lee](https://github.com/iamchani)
- [rumble](https://github.com/m1212e/rumble) (GraphQL + Drizzle + Abilities ) by [m1212e](https://github.com/m1212e)[(introduction)](https://github.com/hayes/pothos/discussions/1414)

## [Templates and Examples](https://pothos-graphql.dev/docs/resources#templates-and-examples)

- [Pothos GraphQL Server](https://github.com/theogravity/graphql-pothos-server-example) by [Theo Gravity](https://github.com/theogravity)
- [GraphQL countries server](https://github.com/gbicou/countries-server) by [Benjamin VIELLARD](https://github.com/gbicou)
- [datalake-graphql-wrapper](https://github.com/dbsystel/datalake-graphql-wrapper) by [noxify](https://github.com/noxify)

## [Conference talks](https://pothos-graphql.dev/docs/resources#conference-talks)

- [Pothos + Prisma: delightful, type-safe and efficient GraphQL](https://www.youtube.com/watch?v=LqKPfMmxFxw) by [Michael Hayes](https://twitter.com/yavascript)

## [Paid tools](https://pothos-graphql.dev/docs/resources#paid-tools)

- [Bedrock](https://bedrock.mxstbr.com/) by [Max Stoiber](https://twitter.com/mxstbr)
- [nytro](https://www.nytro.dev/) by [Jordan Gensler](https://twitter.com/vapejuicejordan)

[Sponsors The generous people supporting Pothos development](https://pothos-graphql.dev/docs/sponsors)[Guide Guide for building GraphQL APIs with Pothos](https://pothos-graphql.dev/docs/guide)

### On this page

[Guides and Tutorials](https://pothos-graphql.dev/docs/resources#guides-and-tutorials)[3rd party Tools and Libraries](https://pothos-graphql.dev/docs/resources#3rd-party-tools-and-libraries)[Templates and Examples](https://pothos-graphql.dev/docs/resources#templates-and-examples)[Conference talks](https://pothos-graphql.dev/docs/resources#conference-talks)[Paid tools](https://pothos-graphql.dev/docs/resources#paid-tools)

---

## URL: https://pothos-graphql.dev/docs/guide/fields

Title: Fields

URL Source: https://pothos-graphql.dev/docs/guide/fields

Markdown Content:
Fields for [Object](https://pothos-graphql.dev/docs/guide/objects) and [Interface](https://pothos-graphql.dev/docs/guide/interfaces) types are defined using a shape function. This is a function that takes a [FieldBuilder](https://pothos-graphql.dev/docs/api/field-builder) as an argument, and returns an object whose keys are field names, and whose values are fields created by the [FieldBuilder](https://pothos-graphql.dev/docs/api/field-builder). These examples will mostly add fields to the `Query` type, but the topics covered in this guide should apply to any object or interface type.

Scalar fields can be defined a couple of different ways:

### [Field method](https://pothos-graphql.dev/docs/guide/fields#field-method)

### [Convenience methods](https://pothos-graphql.dev/docs/guide/fields#convenience-methods)

Convenience methods are just wrappers around the `field` method that omit the `type` option.

Fields for non-scalar fields can also be created with the `field` method.

Some types like [Objects](https://pothos-graphql.dev/docs/guide/objects) and [Interfaces](https://pothos-graphql.dev/docs/guide/interfaces) can be referenced by name if they have a backing model defined in the schema builder.

For types not described in the `SchemaTypes` type provided to the builder, including types that can not be added there like [Unions](https://pothos-graphql.dev/docs/guide/unions) and [Enums](https://pothos-graphql.dev/docs/guide/enums), you can use a `Ref` returned by the builder method that created them in the `type` parameter. For types created using a class ([Objects](https://pothos-graphql.dev/docs/guide/enums) or [Interfaces](https://pothos-graphql.dev/docs/guide/interfaces)) or [Enums](https://pothos-graphql.dev/docs/guide/enums) created using a typescript enum, you can also use the `class` or `enum` that was used to define them.

To create a list field, you can wrap the the type in an array

Fields in Pothos are nullable by default, but fields can be made NonNullable by setting the `nullable` option to `false`. This default can also be changed in the SchemaBuilder constructor, see [Changing Default Nullability](https://pothos-graphql.dev/docs/guide/changing-default-nullability) for more details.

Note that by default even if a list field is nullable, the items in that list are not. The last example above shows how you can make list items nullable.

Some GraphQL implementations have a concept of "default resolvers" that can automatically resolve fields that have a property of the same name in the underlying data. In Pothos, these relationships need to be explicitly defined, but there are helper methods that make exposing fields easier.

These helpers are not available for root types (Query, Mutation and Subscription), but will work on any other object type or interface.

The available expose helpers are:

- `exposeString`
- `exposeInt`
- `exposeFloat`
- `exposeBoolean`
- `exposeID`
- `exposeStringList`
- `exposeIntList`
- `exposeFloatList`
- `exposeBooleanList`
- `exposeIDList`

Arguments for a field can be defined in the options for a field:

For more information see the [Arguments Guide](https://pothos-graphql.dev/docs/guide/args).

In addition to being able to define fields when defining types, you can also add additional fields independently. This is useful for breaking up types with a lot of fields into multiple files, or co-locating fields with their type (e.g., add all query/mutation fields for a type in the same file where the type is defined).

To see all the methods available for defining fields see the [SchemaBuilder API](https://pothos-graphql.dev/docs/guide/schema-builder)

You can use `t.listRef` to create a list of lists

---

## URL: https://pothos-graphql.dev/docs/guide/scalars

Title: Scalars

URL Source: https://pothos-graphql.dev/docs/guide/scalars

Markdown Content:
Scalars

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 1: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Objects](https://pothos-graphql.dev/docs/guide/objects)[Queries, Mutations and Subscriptions](https://pothos-graphql.dev/docs/guide/queries-mutations-and-subscriptions)[SchemaBuilder](https://pothos-graphql.dev/docs/guide/schema-builder)[Fields](https://pothos-graphql.dev/docs/guide/fields)[Using args](https://pothos-graphql.dev/docs/guide/args)[Using Context](https://pothos-graphql.dev/docs/guide/context)[Input Objects](https://pothos-graphql.dev/docs/guide/inputs)[Enums](https://pothos-graphql.dev/docs/guide/enums)[Scalars](https://pothos-graphql.dev/docs/guide/scalars)[Interfaces](https://pothos-graphql.dev/docs/guide/interfaces)[Unions](https://pothos-graphql.dev/docs/guide/unions)[Using plugins](https://pothos-graphql.dev/docs/guide/using-plugins)[Inferring Types](https://pothos-graphql.dev/docs/guide/inferring-types)[File layout](https://pothos-graphql.dev/docs/guide/app-layout)[Generating client types](https://pothos-graphql.dev/docs/guide/generating-client-types)[Patterns](https://pothos-graphql.dev/docs/guide/patterns)[Printing Schemas](https://pothos-graphql.dev/docs/guide/printing-schemas)[Default nullability](https://pothos-graphql.dev/docs/guide/changing-default-nullability)[Writing plugins](https://pothos-graphql.dev/docs/guide/writing-plugins)[Using Deno](https://pothos-graphql.dev/docs/guide/deno)[Circular References](https://pothos-graphql.dev/docs/guide/circular-references)[Troubleshooting](https://pothos-graphql.dev/docs/guide/troubleshooting)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

Scalars Adding Custom GraphQL Scalars

[Guide](https://pothos-graphql.dev/docs/guide)

# Scalars

## [Adding Custom GraphQL Scalars](https://pothos-graphql.dev/docs/guide/scalars#adding-custom-graphql-scalars)

To add a custom scalar that has been implemented as GraphQLScalar from [graphql-js](https://github.com/graphql/graphql-js) you need to provide some type information in SchemaTypes generic parameter of the builder:

```
const builder = new SchemaBuilder<{
  Scalars: {
    Date: {
      Input: Date;
      Output: Date;
    };
  };
}>({});

builder.addScalarType('Date', CustomDateScalar);
```

The Input type is the type that will be used when the type is used in an argument or `InputObject`. The Output type is used to validate the resolvers return the correct value when using the scalar in their return type.

For many scalars `Input` and `Output` will be the same, but they do not always need to match. The Scalars generic can be used to change types for the built-in scalars.

For example, the defaults for the ID scalar might not be exactly what you want, you can customize the values like so:

```
const builder = new SchemaBuilder<{
  Scalars: {
    ID: {
      // type all ID arguments and input values as string
      Input: string;
      // Allow resolvers for ID fields to return strings, numbers, or bigints
      Output: string | number | bigint;
    };
  };
}>({});
```

## [Adding Scalars from `graphql-scalars`](https://pothos-graphql.dev/docs/guide/scalars#adding-scalars-from-graphql-scalars)

Similarly to adding your own custom scalars, you can utilize scalars from the [graphql-scalars](https://the-guild.dev/graphql/scalars/docs) library by also providing the types through the SchemaTypes generic parameter.

Note that when implementing the graphql-scalars library, the best types to use for `Input` and `Output` types are _not_ always intuitive. For example, you might assume that the `JSON` type from graphql-scalars would utilize the global `JSON` type, or another JSON type imported from a library that tries to enumerate potential JSON values, but it is usually better to just use `unknown`. A good place to start if you are unsure what type to use it the check the `codegenScalarType` inside file where the scalar is defined by `graphql-scalars` ([BigInt scalar definition, for reference](https://github.com/Urigo/graphql-scalars/blob/6bdccebb27a7f9be7b5d01dfb052a3e9c17432fc/src/scalars/BigInt.ts#L92)). This isn't defined for all scalars, and some scalars use `any` in which case `unknown` might be a better option.

```
import { DateResolver, JSONResolver } from 'graphql-scalars';

const builder = new SchemaBuilder<{
  Scalars: {
    JSON: {
      Input: unknown;
      Output: unknown;
    };
    Date: {
      Input: Date;
      Output: Date;
    };
  };
}>({});

builder.addScalarType('JSON', JSONResolver);
builder.addScalarType('Date', DateResolver);
```

## [Defining your own scalars](https://pothos-graphql.dev/docs/guide/scalars#defining-your-own-scalars)

```
const builder = new SchemaBuilder<{
  Scalars: {
    PositiveInt: {
      Input: number;
      Output: number;
    };
  };
}>({});

builder.scalarType('PositiveInt', {
  serialize: (n) => n,
  parseValue: (n) => {
    if (n >= 0) {
      return n;
    }

    throw new Error('Value must be positive');
  },
});
```

## [Using scalars](https://pothos-graphql.dev/docs/guide/scalars#using-scalars)

```
builder.queryFields((t) => ({
  date: t.field({
    type: 'Date',
    resolve: () => new Date(),
  }),

  positive: t.field({
    type: 'PositiveInt',
    resolve: () => 5,
  }),
}));
```

[Enums Guide for defining Enum types in Pothos](https://pothos-graphql.dev/docs/guide/enums)[Interfaces Guide for defining Interface types in Pothos](https://pothos-graphql.dev/docs/guide/interfaces)

### On this page

[Adding Custom GraphQL Scalars](https://pothos-graphql.dev/docs/guide/scalars#adding-custom-graphql-scalars)[Adding Scalars from `graphql-scalars`](https://pothos-graphql.dev/docs/guide/scalars#adding-scalars-from-graphql-scalars)[Defining your own scalars](https://pothos-graphql.dev/docs/guide/scalars#defining-your-own-scalars)[Using scalars](https://pothos-graphql.dev/docs/guide/scalars#using-scalars)

---

## URL: https://pothos-graphql.dev/docs/guide/interfaces

Title: Interfaces

URL Source: https://pothos-graphql.dev/docs/guide/interfaces

Markdown Content:
Interfaces

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 1: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Objects](https://pothos-graphql.dev/docs/guide/objects)[Queries, Mutations and Subscriptions](https://pothos-graphql.dev/docs/guide/queries-mutations-and-subscriptions)[SchemaBuilder](https://pothos-graphql.dev/docs/guide/schema-builder)[Fields](https://pothos-graphql.dev/docs/guide/fields)[Using args](https://pothos-graphql.dev/docs/guide/args)[Using Context](https://pothos-graphql.dev/docs/guide/context)[Input Objects](https://pothos-graphql.dev/docs/guide/inputs)[Enums](https://pothos-graphql.dev/docs/guide/enums)[Scalars](https://pothos-graphql.dev/docs/guide/scalars)[Interfaces](https://pothos-graphql.dev/docs/guide/interfaces)[Unions](https://pothos-graphql.dev/docs/guide/unions)[Using plugins](https://pothos-graphql.dev/docs/guide/using-plugins)[Inferring Types](https://pothos-graphql.dev/docs/guide/inferring-types)[File layout](https://pothos-graphql.dev/docs/guide/app-layout)[Generating client types](https://pothos-graphql.dev/docs/guide/generating-client-types)[Patterns](https://pothos-graphql.dev/docs/guide/patterns)[Printing Schemas](https://pothos-graphql.dev/docs/guide/printing-schemas)[Default nullability](https://pothos-graphql.dev/docs/guide/changing-default-nullability)[Writing plugins](https://pothos-graphql.dev/docs/guide/writing-plugins)[Using Deno](https://pothos-graphql.dev/docs/guide/deno)[Circular References](https://pothos-graphql.dev/docs/guide/circular-references)[Troubleshooting](https://pothos-graphql.dev/docs/guide/troubleshooting)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

Interfaces Defining Interface Types

[Guide](https://pothos-graphql.dev/docs/guide)

# Interfaces

## [Defining Interface Types](https://pothos-graphql.dev/docs/guide/interfaces#defining-interface-types)

Defining interfaces works exactly like [defining Objects](https://pothos-graphql.dev/docs/guide/objects), using `Interfaces` key in SchemaTypes object for the builder, and `interfaceRef` rather than `objectRef`.

In this example we'll use an Animal class and a Giraffe class that extends it:

```
export class Animal {
  diet: Diet;

  constructor(diet: Diet) {
    this.diet = diet;
  }
}

export class Giraffe extends Animal {
  name: string;
  birthday: Date;
  heightInMeters: number;

  constructor(name: string, birthday: Date, heightInMeters: number) {
    super(Diet.HERBIVOROUS);

    this.name = name;
    this.birthday = birthday;
    this.heightInMeters = heightInMeters;
  }
}
export enum Diet {
  HERBIVOROUS,
  CARNIVOROUS,
  OMNIVORIOUS,
}
```

Again, using classes is completely optional. The only requirement for interfaces is that the the type used for defining objects must be a superset of the the types of any interfaces they implement.

Now that we have our classes set up we can define the interface type. and add a enum definitions for our diet field:

```
builder.interfaceType(Animal, {
  name: 'AnimalFromClass',
  fields: (t) => ({
    diet: t.expose('diet', {
      type: Diet,
    }),
  }),
});

builder.enumType(Diet, {
  name: 'Diet',
});
```

## [implementing interfaces with object types](https://pothos-graphql.dev/docs/guide/interfaces#implementing-interfaces-with-object-types)

```
builder.objectType(Giraffe, {
  name: 'Giraffe',
  interfaces: [Animal],
  isTypeOf: (value) => value instanceof Giraffe,
  fields: (t) => ({
    name: t.exposeString('name', {}),
  }),
});
```

There are 2 new properties here: `interfaces` and `isTypeOf`.

Interfaces is an array of interfaces that the object type implements, and `isTypeOf` is a function that is run whenever we have an object of the interface type and we want to see if it's actually an instance of our object type.

## [Using an Interface as a return type](https://pothos-graphql.dev/docs/guide/interfaces#using-an-interface-as-a-return-type)

Using interfaces as return types for fields works just like objects:

```
builder.queryFields((t) => ({
  animal: t.field({
    type: 'Animal',
    resolve: () => new Giraffe('James', new Date(Date.UTC(2012, 11, 12)), 5.2),
  }),
}));
```

## [Querying interface fields](https://pothos-graphql.dev/docs/guide/interfaces#querying-interface-fields)

We can query interface fields like diet on any field that returns a giraffe:

```
query {
  giraffe {
    name
    diet
  }
}
```

or we can query a field that returns an interface and select different fields depending on the concrete type:

```
query {
  animal {
    diet
    ... on Giraffe {
      name
    }
  }
}
```

[Scalars Guide for defining Scalar types in Pothos](https://pothos-graphql.dev/docs/guide/scalars)[Unions Guide for defining Union types in Pothos](https://pothos-graphql.dev/docs/guide/unions)

### On this page

[Defining Interface Types](https://pothos-graphql.dev/docs/guide/interfaces#defining-interface-types)[implementing interfaces with object types](https://pothos-graphql.dev/docs/guide/interfaces#implementing-interfaces-with-object-types)[Using an Interface as a return type](https://pothos-graphql.dev/docs/guide/interfaces#using-an-interface-as-a-return-type)[Querying interface fields](https://pothos-graphql.dev/docs/guide/interfaces#querying-interface-fields)

---

## URL: https://pothos-graphql.dev/docs/guide/unions

Title: Unions

URL Source: https://pothos-graphql.dev/docs/guide/unions

Markdown Content:
Unions

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 1: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Objects](https://pothos-graphql.dev/docs/guide/objects)[Queries, Mutations and Subscriptions](https://pothos-graphql.dev/docs/guide/queries-mutations-and-subscriptions)[SchemaBuilder](https://pothos-graphql.dev/docs/guide/schema-builder)[Fields](https://pothos-graphql.dev/docs/guide/fields)[Using args](https://pothos-graphql.dev/docs/guide/args)[Using Context](https://pothos-graphql.dev/docs/guide/context)[Input Objects](https://pothos-graphql.dev/docs/guide/inputs)[Enums](https://pothos-graphql.dev/docs/guide/enums)[Scalars](https://pothos-graphql.dev/docs/guide/scalars)[Interfaces](https://pothos-graphql.dev/docs/guide/interfaces)[Unions](https://pothos-graphql.dev/docs/guide/unions)[Using plugins](https://pothos-graphql.dev/docs/guide/using-plugins)[Inferring Types](https://pothos-graphql.dev/docs/guide/inferring-types)[File layout](https://pothos-graphql.dev/docs/guide/app-layout)[Generating client types](https://pothos-graphql.dev/docs/guide/generating-client-types)[Patterns](https://pothos-graphql.dev/docs/guide/patterns)[Printing Schemas](https://pothos-graphql.dev/docs/guide/printing-schemas)[Default nullability](https://pothos-graphql.dev/docs/guide/changing-default-nullability)[Writing plugins](https://pothos-graphql.dev/docs/guide/writing-plugins)[Using Deno](https://pothos-graphql.dev/docs/guide/deno)[Circular References](https://pothos-graphql.dev/docs/guide/circular-references)[Troubleshooting](https://pothos-graphql.dev/docs/guide/troubleshooting)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

Unions Using Union Types

[Guide](https://pothos-graphql.dev/docs/guide)

# Unions

Union types are defined with a list of object types:

```
const builder = new SchemaBuilder<{
  Objects: {
    GiraffeStringFact: { factKind: 'string'; fact: string };
    GiraffeNumericFact: { factKind: 'number'; fact: string; value: number };
  };
}>({});

builder.objectType('GiraffeStringFact', {
  fields: (t) => ({
    fact: t.exposeString('fact', {}),
  }),
});

const GiraffeNumericFact = builder.objectType('GiraffeNumericFact', {
  fields: (t) => ({
    fact: t.exposeString('fact', {}),
    value: t.exposeFloat('value', {}),
  }),
});

const GiraffeFact = builder.unionType('GiraffeFact', {
  types: ['GiraffeStringFact', GiraffeNumericFact],
  resolveType: (fact) => {
    switch (fact.factKind) {
      case 'number':
        return GiraffeNumericFact;
      case 'string':
        return 'GiraffeStringFact';
    }
  },
});
```

The `types` array can either contain Object type names defined in SchemaTypes, or and Object `Ref` created by object type. `builder.objectType`, `builder.objectRef` or other method, or a class that was used to implement an object type.

The `resolveType` function will be called with each item returned by a field that returns the unionType, and is used to determine which concrete the value corresponds to. It is usually good to have a shared property you can use to differentiate your union members.

## [Using Union Types](https://pothos-graphql.dev/docs/guide/unions#using-union-types)

```
builder.queryField('giraffeFacts', (t) =>
  t.field({
    type: [GiraffeFact],
    resolve: () => {
      const fact1 = {
        factKind: 'string',
        fact: 'A giraffe’s spots are much like human fingerprints. No two individual giraffes have exactly the same pattern',
      } as const;

      const fact2 = {
        factKind: 'number',
        fact: 'Top speed (MPH)',
        value: 35,
      } as const;

      return [fact1, fact2];
    },
  }),
);
```

[Interfaces Guide for defining Interface types in Pothos](https://pothos-graphql.dev/docs/guide/interfaces)[Using plugins Guide for using plugins with Pothos](https://pothos-graphql.dev/docs/guide/using-plugins)

### On this page

[Using Union Types](https://pothos-graphql.dev/docs/guide/unions#using-union-types)

---

## URL: https://pothos-graphql.dev/docs/guide/using-plugins

Title: Using plugins

URL Source: https://pothos-graphql.dev/docs/guide/using-plugins

Markdown Content:
Using plugins with Pothos is fairly easy, but works a little differently than other plugin systems you may be familiar with. One of the most important things to note is that importing plugins may have some side effects on the Schema builder, and it is recommended to only import the plugins you are actually using.

The reason for this is that Pothos's plugin system was designed to allow plugins to contribute features in a way that feels like they are built into the core API, and allow the plugins to take full advantage of the type system. This means that plugins can extend the core types in Pothos with their own properties, which happens as soon as the plugin is imported.

Each plugin should have setup instructions, but should work in a similar way.

First install the plugin:

Next import the plugin's default export (which should just be the name of the plugin), and pass it when you create your schema builder.

Some plugins may allow you to use your own types for one of their features. This is done by passing types in through the Generic SchemaTypes used by the Schema builder:

This types can then be used in other parts of the API (eg. defining the scopes on a field), but the details of how these types are used will be specific to each plugin, and should be covered in the documentation for the plugin.

In some cases, it may be important to understand the order in which plugins are applied. All plugin lifecycle hooks are applied in REVERSE order. This is done to ensure that the most important (first) plugins are applied after all other effects have been applied. For plugins that wrap resolvers, because the first plugins are applied last, they will be the outermost layer of wrapping an applied executed first. This means it is important to have plugins like `scope-auth` listed before other less critical plugins in your SchemaBuilder.

---

## URL: https://pothos-graphql.dev/docs/guide/inferring-types

Title: Inferring Types

URL Source: https://pothos-graphql.dev/docs/guide/inferring-types

Markdown Content:
Inferring Types

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 1: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Objects](https://pothos-graphql.dev/docs/guide/objects)[Queries, Mutations and Subscriptions](https://pothos-graphql.dev/docs/guide/queries-mutations-and-subscriptions)[SchemaBuilder](https://pothos-graphql.dev/docs/guide/schema-builder)[Fields](https://pothos-graphql.dev/docs/guide/fields)[Using args](https://pothos-graphql.dev/docs/guide/args)[Using Context](https://pothos-graphql.dev/docs/guide/context)[Input Objects](https://pothos-graphql.dev/docs/guide/inputs)[Enums](https://pothos-graphql.dev/docs/guide/enums)[Scalars](https://pothos-graphql.dev/docs/guide/scalars)[Interfaces](https://pothos-graphql.dev/docs/guide/interfaces)[Unions](https://pothos-graphql.dev/docs/guide/unions)[Using plugins](https://pothos-graphql.dev/docs/guide/using-plugins)[Inferring Types](https://pothos-graphql.dev/docs/guide/inferring-types)[File layout](https://pothos-graphql.dev/docs/guide/app-layout)[Generating client types](https://pothos-graphql.dev/docs/guide/generating-client-types)[Patterns](https://pothos-graphql.dev/docs/guide/patterns)[Printing Schemas](https://pothos-graphql.dev/docs/guide/printing-schemas)[Default nullability](https://pothos-graphql.dev/docs/guide/changing-default-nullability)[Writing plugins](https://pothos-graphql.dev/docs/guide/writing-plugins)[Using Deno](https://pothos-graphql.dev/docs/guide/deno)[Circular References](https://pothos-graphql.dev/docs/guide/circular-references)[Troubleshooting](https://pothos-graphql.dev/docs/guide/troubleshooting)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

[Guide](https://pothos-graphql.dev/docs/guide)

# Inferring Types

In some cases you may want to use the types from your input of object refs to build helpers, or provide accurate types for other functions.

To get types from any Pothos `ref` object, you can use the `$inferType` and `$inferInput` properties on the ref. This pattern is inspired by [drizzle ORM](https://orm.drizzle.team/).

```
const MyInput = builder.inputType('MyInput', {
  fields: (t) => ({
    id: t.id({ required: true }),
    name: t.string({ required: true }),
  }),
});

// { id: string; name: string; }
type MyInputShape = typeof MyInput.$inferInput;

// infer the shape of the Prisma User model
const UserRef = builder.prismaObject('User', {});
type UserType = typeof UserRef.$inferType;
```

When building helpers, most Pothos types have a generic called `Types` that extends `SchemaTypes`. This combines all the defaults and settings passed in when creating the SchemaBuilder. To make you own type helpers and utility functions, you often need access the the `Types` used by your builder.

This can be inferred from the builder using `typeof builder.$inferSchemaTypes`.

The following is a simple helper that for creating objects that have an `id` field. The helper itself isn't that useful, but shows how inferring SchemaTypes from a builder can work.

```
type BuilderTypes = typeof builder.$inferSchemaTypes;

function createObjectWithId<T extends { id: string }>(
  name: string,
  fields: (t: PothosSchemaTypes.ObjectFieldBuilder<BuilderTypes, T>) => FieldMap,
) {
  const ref = builder.objectRef<T>(name);

  ref.implement({
    fields: (t) => ({
      ...fields(t),
      id: t.id({
        resolve: (parent) => parent.id,
        nullable: false,
      }),
    }),
  });

  return ref;
}

createObjectWithId<{
  id: string;
  name: string;
}>('User', (t) => ({
  name: t.exposeString('name'),
}));
```

Rather than explicitly using the inferred type, you can also infer SchemaTypes from the builder in an argument. In the following example, we pass in the builder to the createPaginationArgs, and infer the `Types` from the provided builder. This is useful when building helpers that might be used with multiple builder instances.

```
function createPaginationArgs<Types extends SchemaTypes>(
  builder: PothosSchemaTypes.SchemaBuilder<Types>,
) {
  return builder.args((t) => ({
    limit: t.int(),
    offset: t.int(),
  }));
}

builder.queryField('getUsers', (t) =>
  t.field({
    type: [Shaveable],
    args: {
      ...createPaginationArgs(builder),
    },
    resolve: () => [],
  }),
);
```

[Using plugins Guide for using plugins with Pothos](https://pothos-graphql.dev/docs/guide/using-plugins)[File layout Guide for Pothos app layouts](https://pothos-graphql.dev/docs/guide/app-layout)

---

## URL: https://pothos-graphql.dev/docs/guide/app-layout

Title: File layout

URL Source: https://pothos-graphql.dev/docs/guide/app-layout

Markdown Content:
Pothos tries not to be opinionated about how you structure your code, and provides multiple ways of doing many things. This short guide covers a few conventions I use, as a starting place for anyone who is just looking for a decent setup that should just work. Everything suggested here is just a recommendation and is completely optional.

Here are a few files I create in almost every Pothos schema I have built:

- `src/server.ts`: Setup and run your server (This might be graphql-yoga or @apollo/server)

- `src/builder.ts`: Setup for your schema builder. Does not contain any definitions for types in your schema

- `src/schema.ts` or `src/schema/index.ts`: Imports all the files that define part of your schema, but does not define types itself. Exports `builder.toSchema()`

- `src/types.ts`: Define shared types used across your schema including a type for your context object. This should be imported when creating your builder, and may be used by many other files.

- `src/schema/*.ts`: Actual definitions for your schema types.

Import types directly from the files that define them rather than importing from another file like `index.ts` that re-exports them. `index.ts` files can still be useful for loading all files in a directory, but they should generally NOT export any values.

Which plugins you use is completely up to you. For my own projects, I will use the `simple-objects`, `scope-auth`, and `mocks` plugins in every project, and some of the other plugins as needed.

`mocks` and `scope-auth` are fairly self explanatory. The `simple-objects` plugin can make building out a graph much quicker, because you don't have to have explicit types or models for every object in your graph. I frequently find that I just want to add an object of a specific shape, and then let the parent field figure out how to return an object of the right shape.

Pothos gives you a lot of control over how you define the types that your schema and resolvers use, which can make figuring out the right approach confusing at first. In my projects, I try to avoid using the `SchemaTypes` approach for defining backing models. Instead, I tend to use model classes for defining most of the important objects in my graph, and fall back to using either the simple-objects plugin or `builder.objectRef<Shape>(name).implement({...})` when it does not make sense to define a class for my data.

In bigger graphs, having all your queries/entry points defined in one place can become hard to manage. Instead, I prefer to define queries alongside the types they return. For example, queries for a `User` type would be defined in the same file that contains the definition for the `User` type, rather than in a central `queries.ts` file (using `builder.queryField`).

---

## URL: https://pothos-graphql.dev/docs/guide/generating-client-types

Title: Generating client types

URL Source: https://pothos-graphql.dev/docs/guide/generating-client-types

Markdown Content:
Generating client types

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 1: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Objects](https://pothos-graphql.dev/docs/guide/objects)[Queries, Mutations and Subscriptions](https://pothos-graphql.dev/docs/guide/queries-mutations-and-subscriptions)[SchemaBuilder](https://pothos-graphql.dev/docs/guide/schema-builder)[Fields](https://pothos-graphql.dev/docs/guide/fields)[Using args](https://pothos-graphql.dev/docs/guide/args)[Using Context](https://pothos-graphql.dev/docs/guide/context)[Input Objects](https://pothos-graphql.dev/docs/guide/inputs)[Enums](https://pothos-graphql.dev/docs/guide/enums)[Scalars](https://pothos-graphql.dev/docs/guide/scalars)[Interfaces](https://pothos-graphql.dev/docs/guide/interfaces)[Unions](https://pothos-graphql.dev/docs/guide/unions)[Using plugins](https://pothos-graphql.dev/docs/guide/using-plugins)[Inferring Types](https://pothos-graphql.dev/docs/guide/inferring-types)[File layout](https://pothos-graphql.dev/docs/guide/app-layout)[Generating client types](https://pothos-graphql.dev/docs/guide/generating-client-types)[Patterns](https://pothos-graphql.dev/docs/guide/patterns)[Printing Schemas](https://pothos-graphql.dev/docs/guide/printing-schemas)[Default nullability](https://pothos-graphql.dev/docs/guide/changing-default-nullability)[Writing plugins](https://pothos-graphql.dev/docs/guide/writing-plugins)[Using Deno](https://pothos-graphql.dev/docs/guide/deno)[Circular References](https://pothos-graphql.dev/docs/guide/circular-references)[Troubleshooting](https://pothos-graphql.dev/docs/guide/troubleshooting)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

Generating client types

[Guide](https://pothos-graphql.dev/docs/guide)

# Generating client types

Pothos does not have a built in mechanism for generating types to use with a client, but [graphql-code-generator](https://www.graphql-code-generator.com/) can be configured to consume a schema directly from your typescript files.

## [Export your schema](https://pothos-graphql.dev/docs/guide/generating-client-types#export-your-schema)

The first thing you will need is a file that exports your built schema. The schema should be exported as `schema` or as the default export. This will be used to generate your client types, but can also be the schema you use in your server.

```
// schema.ts

// Import the builder
import builder from './builder';

// Import your type definitions
import './types/Query';
import './types/User';
import './types/Posts';

// Build and export the schema
export const schema = builder.toSchema();
```

## [Setting up graphql-code-generator](https://pothos-graphql.dev/docs/guide/generating-client-types#setting-up-graphql-code-generator)

There are many different ways to set up graphql-code-generator, and the details depend a lot on your needs.

See the [graphql-code-generator documentation](https://www.graphql-code-generator.com/docs/getting-started/installation) for more details.

### [Install the codegen packages](https://pothos-graphql.dev/docs/guide/generating-client-types#install-the-codegen-packages)

npm pnpm yarn bun

```
npm install --save graphql
npm install --save -D typescript @graphql-codegen/cli @graphql-codegen/client-preset
```

### [Configure the codegen to import your schema](https://pothos-graphql.dev/docs/guide/generating-client-types#configure-the-codegen-to-import-your-schema)

Create a `codegen.ts` file in the root of your project:

```
import type { CodegenConfig } from '@graphql-codegen/cli';
import { printSchema } from 'graphql';
import { schema } from './src/schema';

const config: CodegenConfig = {
  schema: printSchema(schema),
  documents: ['src/**/*.tsx'],
  generates: {
    './src/gql/': {
      preset: 'client',
      plugins: [],
    },
  },
};

export default config;
```

You can customize this config as needed, but the relevant parts are:

- Importing your GraphQL schema, this should be the result of calling `builder.toSchema({})`
- using `printSchema` from `graphql` to convert the schema to a string

## [Generating a schema.graphql file with graphql-code-generator](https://pothos-graphql.dev/docs/guide/generating-client-types#generating-a-schemagraphql-file-with-graphql-code-generator)

You can generate a schema.graphql file with graphql-code-generator by adding the `schema-ast` plugin:

npm pnpm yarn bun

`npm install --save -D @graphql-codegen/schema-ast`

```
// codegen.ts
import { printSchema } from 'graphql';
import type { CodegenConfig } from '@graphql-codegen/cli';
import { schema } from './src/schema';

const config: CodegenConfig = {
  schema: printSchema(schema),
  documents: ['src/**/*.tsx'],
  generates: {
    './src/gql/': {
      preset: 'client',
      plugins: [],
    },
    'schema.graphql': {
      plugins: ['schema-ast'],
    },
  },
};

export default config;
```

## [Adding scalars](https://pothos-graphql.dev/docs/guide/generating-client-types#adding-scalars)

If you are using scalars (e.g. from `graphql-scalars`), you will need to add them to `codegen.ts` or else they will resolve to `any`. Here is an example for `UUID` and `DateTime`:

```
const config: CodegenConfig = {
  ...,
  config: {
    scalars: {
      UUID: 'string',
      DateTime: 'Date',
    },
  },
};
```

## [Alternatives](https://pothos-graphql.dev/docs/guide/generating-client-types#alternatives)

In some cases you may want to use an alternative method for loading you schema.

### [Printing the schema to a file](https://pothos-graphql.dev/docs/guide/generating-client-types#printing-the-schema-to-a-file)

You can use the `printSchema` function from `graphql` to print your schema to a file, see [Printing Schemas](https://pothos-graphql.dev/docs/guide/printing-schemas) for more details:

By writing the schema to a file, you will be able to load the schema from a file instead importing it each time you want to generate your schema.

Having your schema written to a file, and checked into source control has many benifits, like easier code reviews, and better interoperability with other schema dependent graphql tools, so setting this up is worth while even if you do not need it for generating client types:

```
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './path/to/schema.graphql',
  documents: ['src/**/*.tsx'],
  generates: {
    './src/gql/': {
      preset: 'client',
      plugins: [],
    },
  },
};

export default config;
```

### [Using introspection from your dev (or production) server](https://pothos-graphql.dev/docs/guide/generating-client-types#using-introspection-from-your-dev-or-production-server)

Rather than using a schema SDL file, graphql-code-generator can also can use introspection to load your schema. To do this, you will need to ensure that your server has introspection enabled, most servers will have introspection enabled by default in development, and disabled in production.

You can then configure graphql-code-generator to use introspection by passing the URL to your graphql endpoint:

```
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'https://localhost:3000/graphql',
  documents: ['src/**/*.tsx'],
  generates: {
    './src/gql/': {
      preset: 'client',
      plugins: [],
    },
  },
};

export default config;
```

[File layout Guide for Pothos app layouts](https://pothos-graphql.dev/docs/guide/app-layout)[Patterns Guide for using common patterns in Pothos](https://pothos-graphql.dev/docs/guide/patterns)

### On this page

[Export your schema](https://pothos-graphql.dev/docs/guide/generating-client-types#export-your-schema)[Setting up graphql-code-generator](https://pothos-graphql.dev/docs/guide/generating-client-types#setting-up-graphql-code-generator)[Install the codegen packages](https://pothos-graphql.dev/docs/guide/generating-client-types#install-the-codegen-packages)[Configure the codegen to import your schema](https://pothos-graphql.dev/docs/guide/generating-client-types#configure-the-codegen-to-import-your-schema)[Generating a schema.graphql file with graphql-code-generator](https://pothos-graphql.dev/docs/guide/generating-client-types#generating-a-schemagraphql-file-with-graphql-code-generator)[Adding scalars](https://pothos-graphql.dev/docs/guide/generating-client-types#adding-scalars)[Alternatives](https://pothos-graphql.dev/docs/guide/generating-client-types#alternatives)[Printing the schema to a file](https://pothos-graphql.dev/docs/guide/generating-client-types#printing-the-schema-to-a-file)[Using introspection from your dev (or production) server](https://pothos-graphql.dev/docs/guide/generating-client-types#using-introspection-from-your-dev-or-production-server)

---

## URL: https://pothos-graphql.dev/docs/guide/patterns

Title: Patterns

URL Source: https://pothos-graphql.dev/docs/guide/patterns

Markdown Content:
If you have common fields or arguments that are shared across multiple types (but you don't want to use an interface to share the common logic) you can write helper functions to generate these fields for you.

### [Objects and Interfaces](https://pothos-graphql.dev/docs/guide/patterns#objects-and-interfaces)

This will apply the `id` and `idLength` fields to both of the object types. The `ObjectRef` type is what is returned when creating an object (or when calling `builder.objectRef`). It takes 2 generic parameters: The first is the shape a resolver is expected to resolve to for that type, and the second is the shape of the parent arg when defining a field on that type. These 2 are generally the same, but can differ for some special cases (like with `loadableObject` from the dataloader plugin, which allows resolvers to resolve to an `ID` rather than the actual object). In this case, we only care about the second parameter since we are defining fields.

If you want to define fields on an interface, you can use `InterfaceRef` instead. If your helper accepts both, you can differentiate the refs by using `ref.kind` which will be either `Object` or `Interface`.

### [Args](https://pothos-graphql.dev/docs/guide/patterns#args)

Args are a little more complicated fields on objects and interfaces. Pothos infers the shape of args for your resolvers, so you can't just add on more args later. Instead, we can define a helper that returns a set of args to apply to your field. To make this work, we need to get a few extra types:

In this example `SchemaTypes` are the types that will be provided to the builder when it is created. Internally Pothos extends these with some default types. This extended set of types is what gets passed around in many of Pothos's internal types. To correctly type our helper function, we need to create a version of `SchemaTypes` with the same defaults Pothos adds in (`TypesWithDefaults`). Once we have `TypesWithDefaults` we can define a helper function that accepts an arg builder (`ArgBuilder<TypesWithDefaults>`) and creates a set of arguments.

The last step is to call your helper with `t.arg` (the arg builder), and spread the returned args into the args object for the current field.

### [Input fields](https://pothos-graphql.dev/docs/guide/patterns#input-fields)

Input fields are similar to args, and also all need to be present when the type is defined so that Pothos can infer the correct types.

---

## URL: https://pothos-graphql.dev/docs/guide/printing-schemas

Title: Printing Schemas

URL Source: https://pothos-graphql.dev/docs/guide/printing-schemas

Markdown Content:
Printing Schemas

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 1: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Objects](https://pothos-graphql.dev/docs/guide/objects)[Queries, Mutations and Subscriptions](https://pothos-graphql.dev/docs/guide/queries-mutations-and-subscriptions)[SchemaBuilder](https://pothos-graphql.dev/docs/guide/schema-builder)[Fields](https://pothos-graphql.dev/docs/guide/fields)[Using args](https://pothos-graphql.dev/docs/guide/args)[Using Context](https://pothos-graphql.dev/docs/guide/context)[Input Objects](https://pothos-graphql.dev/docs/guide/inputs)[Enums](https://pothos-graphql.dev/docs/guide/enums)[Scalars](https://pothos-graphql.dev/docs/guide/scalars)[Interfaces](https://pothos-graphql.dev/docs/guide/interfaces)[Unions](https://pothos-graphql.dev/docs/guide/unions)[Using plugins](https://pothos-graphql.dev/docs/guide/using-plugins)[Inferring Types](https://pothos-graphql.dev/docs/guide/inferring-types)[File layout](https://pothos-graphql.dev/docs/guide/app-layout)[Generating client types](https://pothos-graphql.dev/docs/guide/generating-client-types)[Patterns](https://pothos-graphql.dev/docs/guide/patterns)[Printing Schemas](https://pothos-graphql.dev/docs/guide/printing-schemas)[Default nullability](https://pothos-graphql.dev/docs/guide/changing-default-nullability)[Writing plugins](https://pothos-graphql.dev/docs/guide/writing-plugins)[Using Deno](https://pothos-graphql.dev/docs/guide/deno)[Circular References](https://pothos-graphql.dev/docs/guide/circular-references)[Troubleshooting](https://pothos-graphql.dev/docs/guide/troubleshooting)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

Printing Schemas Using graphql-code-generator

[Guide](https://pothos-graphql.dev/docs/guide)

# Printing Schemas

Sometimes it's useful to have an SDL version of your schema. To do this, you can use some tools from the `graphql` package to write your schema out as SDL to a file.

```
import { writeFileSync } from 'fs';
import { printSchema, lexicographicSortSchema } from 'graphql';
import SchemaBuilder from '@pothos/core';

const builder = new SchemaBuilder({});

builder.queryType({
  fields: (t) => ({
    hello: t.string({
      args: {
        name: t.arg.string(),
      },
      resolve: (parent, { name }) => `hello, ${name || 'World'}`,
    }),
  }),
});

const schema = builder.toSchema();
const schemaAsString = printSchema(lexicographicSortSchema(schema));

writeFileSync('/path/to/schema.graphql', schemaAsString);
```

## [Using graphql-code-generator](https://pothos-graphql.dev/docs/guide/printing-schemas#using-graphql-code-generator)

An alternative to printing your schema directly is to generate your schema file using graphql-code-generator.

You can add the `schema-ast` plugin to have graphql-code-generator generate your schema file for you.

See [Generating Client Types](https://pothos-graphql.dev/docs/guide/generating-client-types) for more details

[Patterns Guide for using common patterns in Pothos](https://pothos-graphql.dev/docs/guide/patterns)[Default nullability Guide for changing default nullability in Pothos](https://pothos-graphql.dev/docs/guide/changing-default-nullability)

### On this page

[Using graphql-code-generator](https://pothos-graphql.dev/docs/guide/printing-schemas#using-graphql-code-generator)

---

## URL: https://pothos-graphql.dev/docs/guide/changing-default-nullability

Title: Default nullability

URL Source: https://pothos-graphql.dev/docs/guide/changing-default-nullability

Markdown Content:
Default nullability

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 1: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Objects](https://pothos-graphql.dev/docs/guide/objects)[Queries, Mutations and Subscriptions](https://pothos-graphql.dev/docs/guide/queries-mutations-and-subscriptions)[SchemaBuilder](https://pothos-graphql.dev/docs/guide/schema-builder)[Fields](https://pothos-graphql.dev/docs/guide/fields)[Using args](https://pothos-graphql.dev/docs/guide/args)[Using Context](https://pothos-graphql.dev/docs/guide/context)[Input Objects](https://pothos-graphql.dev/docs/guide/inputs)[Enums](https://pothos-graphql.dev/docs/guide/enums)[Scalars](https://pothos-graphql.dev/docs/guide/scalars)[Interfaces](https://pothos-graphql.dev/docs/guide/interfaces)[Unions](https://pothos-graphql.dev/docs/guide/unions)[Using plugins](https://pothos-graphql.dev/docs/guide/using-plugins)[Inferring Types](https://pothos-graphql.dev/docs/guide/inferring-types)[File layout](https://pothos-graphql.dev/docs/guide/app-layout)[Generating client types](https://pothos-graphql.dev/docs/guide/generating-client-types)[Patterns](https://pothos-graphql.dev/docs/guide/patterns)[Printing Schemas](https://pothos-graphql.dev/docs/guide/printing-schemas)[Default nullability](https://pothos-graphql.dev/docs/guide/changing-default-nullability)[Writing plugins](https://pothos-graphql.dev/docs/guide/writing-plugins)[Using Deno](https://pothos-graphql.dev/docs/guide/deno)[Circular References](https://pothos-graphql.dev/docs/guide/circular-references)[Troubleshooting](https://pothos-graphql.dev/docs/guide/troubleshooting)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

[Guide](https://pothos-graphql.dev/docs/guide)

# Default nullability

By default, Fields and argument in Pothos ar Nullable. This default can be changed be overwritten by setting `nullable: false` in the options for output fields and by setting `required: true` for input fields or arguments.

These defaults may not be the right choice for every application, and changing them on every field can be a pain. Instead, Pothos allows overwriting these defaults when setting up your SchemaBuilder. You will need to provide the new defaults in two places:

1.  In the type parameter for the builder, which enables the type checking to work with your new settings.

2.  In the Builder options, so that the correct schema is built at run time.

```
// Create a Builder that makes output fields nullable by default
export const builder = new SchemaBuilder<{
  DefaultFieldNullability: false;
}>({
  defaultFieldNullability: false,
});

// Create a Builder that makes input fields and arguments required by default
export const builder = new SchemaBuilder<{
  DefaultInputFieldRequiredness: true;
}>({
  defaultInputFieldRequiredness: true,
});
```

[Printing Schemas Guide for printing a Pothos schema to an SDL schema file](https://pothos-graphql.dev/docs/guide/printing-schemas)[Writing plugins Guide for defining Enum types in Pothos](https://pothos-graphql.dev/docs/guide/writing-plugins)

---

## URL: https://pothos-graphql.dev/docs/guide/writing-plugins

Title: Writing plugins

URL Source: https://pothos-graphql.dev/docs/guide/writing-plugins

Markdown Content:
Writing plugins for Pothos may seem a little intimidating at first, because the types used by Pothos are fairly complex. Fortunately, for many types of plugins, the process is actually pretty easy, once you understand the core concepts of how Pothos's type system works. Don't worry if the descriptions don't make complete sense at first. Going through the examples in this guide will hopefully make things seem a lot easier. This guide aims to cover a lot of the most common use cases for creating plugins, but does not contain full API documentation. Exploring the types or source code to see what all is available is highly encouraged, but should not be required for most use cases.

Pothos has 2 main pieces to it's type system:

1.  `PothosSchemaTypes`: A global namespace for shared types
2.  `SchemaTypes`: A collection of types passed around through Generics specific to each instance of `SchemaBuilder`

### [`PothosSchemaTypes`](https://pothos-graphql.dev/docs/guide/writing-plugins#pothosschematypes)

The `PothosSchemaTypes` contains interfaces for all the various options objects used throughout the API, along with some other types that plugins may want to extend. Each of the interfaces can be extended by a plugin to add new options. Each interface takes a number of relevant generic parameters that can be used to make the options more useful. For example, the interface for field options will be passed the shape of the parent, the expected return type, and any arguments.

### [`SchemaTypes`](https://pothos-graphql.dev/docs/guide/writing-plugins#schematypes)

The `SchemaTypes` type is based on the Generic argument passed to the `SchemaBuilder`, and extended with reasonable defaults. Almost every interface in the `PothosSchemaTypes` will have access to it (look for `Types extends SchemaTypes` in the generics of almost any interface). This Type contains the types for Scalars, backing models for some object and interface types, and many custom properties from various plugins. If your plugin needs the user to provide some types that will be shared across the whole schema, this is how you will be able to access them when adding fields to the options objects defined in `PothosSchemaTypes`.

The best place to start is by looking through the [example plugin](https://github.com/hayes/pothos/tree/main/packages/plugin-example).

The general structure of a plugin has 3 main parts:

1.  `index.ts` which contains a plugins actual implementation
2.  `global-types.ts` which contains any additions to `Pothos`s built in types.
3.  `types.ts` which should contain any types that do NOT belong to the global `PothosSchemaTypes` namespace.

To get set up quickly, you can copy these files from the example plugin to suit your needs. The first few things to change are:

1.  The plugin name in `index.ts`
2.  The name of the Plugin class in `index.ts`
3.  The name key/name for the plugin in the `Plugins` interface in `global-types.ts`

After setting up the basic layout of your plugin, I recommend starting by defining the types for your plugin first (in `global-types.ts`) and setting up a test schema that uses your plugin. This allows you to get the user facing API for your plugin working first, so you can see that any new options you add to the API are working as expected, and that any type constraints are enforced correctly. Once you are happy with your API, you can start building out the functionality in index.ts. Building the types first also make the implementation easier because the properties you will need to access in your extension may not exist on the config objects until you have defined your types.

### [`global-types.ts`](https://pothos-graphql.dev/docs/guide/writing-plugins#global-typests)

`global-types.ts` must contain the following:

1.  A declaration of the `PothosSchemaTypes` namespace

2.  An addition to the `Plugins` interface that maps the plugin name, to the plugin type (this needs to be inside the `PothosSchemaTypes` namespace)

`global-types.ts` should NOT include definitions that do not belong to the `PothosSchemaTypes` namespace. Types for your plugin should be added to a separate `types.ts` file, and imported as needed into `global-types.ts`.

To add properties to the various config objects used by the `SchemaBuilder`, you should start by finding the interface that defines that config object in `@pothos/core`. Currently there are 4 main file that define the types that make up `PothosSchemaTypes` namespace.

1.  [`type-options.ts`](https://github.com/hayes/pothos/blob/main/packages/core/src/types/global/type-options.ts):

Contains the interfaces that define the options objects for the various types (Object, Interface, Enum, etc).

2.  [`field-options.ts`](https://github.com/hayes/pothos/blob/main/packages/core/src/types/global/field-options.ts):

Contains the interfaces that define the options objects for creating fields

3.  [`schema-types.ts`](https://github.com/hayes/pothos/blob/main/packages/core/src/types/global/schema-types.ts):

Contains the interfaces for SchemaBuilder options, SchemaTypes, options for `toSchema`, and other utility interfaces that may be useful for plugins to extend that do not fall into one of the other categories.

4.  [`classes.ts`](https://github.com/hayes/pothos/blob/main/packages/core/src/types/global/classes.ts):

Contains interfaces that describe the classes used by Pothos, include `SchemaBuilder` and the various field builder classes.

Once you have identified a type you wish to extend, copy it into the `PothosSchemaTypes` namespace in your `global-types.ts`, but remove all the existing properties. You will need to keep all the Generics used by the interface, and should import the types used in generics from `@pothos/core`. You can now add any new properties to the interface that your plugin needs. Making new properties optional (`newProp?: TypeOfProp`) is recommended for most use cases.

`index.ts` must contain the following:

1.  A bare import of the global types (`import './global-types';`)

2.  The plugins name, which should be typed as a string literal rather than as a generic string:

`const pluginName = 'example'`

3.  A default export of the plugin name `export default pluginName`

4.  A class that extends BasePlugin: `export class PothosExamplePlugin<Types extends SchemaTypes> extends BasePlugin<Types> {}`

`BasePlugin` and `SchemaTypes` can both be imported from `@pothos/core`

5.  A call to register the plugin: `SchemaBuilder.registerPlugin(pluginName, PothosExamplePlugin);`

`SchemaBuilder` can also be imported from `@pothos/core`

### [Life cycle hooks](https://pothos-graphql.dev/docs/guide/writing-plugins#life-cycle-hooks)

The `SchemaBuilder` will instantiate plugins each time the `toSchema` method is called on the builder. As the schema is built, it will invoke the various life cycle methods on each plugin if they have been defined.

To hook into each lifecycle event, simply define the corresponding function in your plugin class. For the exact function signature, see the `index.ts` of the example plugin.

- `onTypeConfig`: Invoked for each type, with the config object that will be used to construct the underlying GraphQL type.

- `onOutputFieldConfig`: Invoked for each Object, or Interface field, with the config object describing the field.

- `onInputFieldConfig`: Invoked for each InputObject field, or field argument, with the config object describing the field.

- `onEnumValueConfig`: Invoked for each value in an enum

- `beforeBuild`: Invoked before building schemas, last chance to add new types or fields.

- `afterBuild`: Invoked with the fully built Schema.

- `wrapResolve`: Invoked when creating the resolver for each field

- `wrapSubscribe`: Invoked for each field in the `Subscriptions` object.

- `wrapResolveType`: Invoked for each Union and Interface.

Each of the lifecycle methods above (except `beforeBuild`) expect a return value that matches their first argument (either a config object, or the resolve/subscribe/resolveType function). If your plugin does not need to modify these values, it can simple return the value that was passed in. When your plugin does need to change one of the config values, you should return a copy of the config object with your modifications, rather than modifying the config object that was passed in. This can be done by either using `Object.assign`, or spreading the original config into a new object `{...originalConfig, newProp: newValue }`.

Each config object will have the properties expected by the GraphQL for creating the types or fields (although some properties like `resolve` will be added later), but will also include a number of Pothos specific properties. These properties include `graphqlKind` to indicate what kind of GraphQL type the config object is for, `pothosOptions`, which contains all the options passed in to the schema builder when creating the type or field.

If your plugin needs to add additional types or fields to the schema it should do this in the `beforeBuild` hook. Any types added to the schema after this, may not be included correctly. Plugins should also account for the fact that a new instance of the plugin will be created each time the schema is called, so any types or fields added the the schema should only be applied once (per schema), even if multiple instances of the plugin are created. The help with this, there is a `runUnique` helper on the base plugin class, which accepts a key, and a callback, and will only run a callback once per schema for the given key.

Below are a few of the most common use cases for how a plugin might extend the Pothos with very simplified examples. Most plugins will likely need a combination of these strategies, and some uses cases may not be well documented. If you are unsure about how to solve a specific problem, feel free to open a GitHub Issue for more help.

In the examples below, when "extending an interface", the interface should be added to the `PothosSchemaTypes` namespace in `global-types.ts`.

### [Adding options to the SchemaBuilder constructor](https://pothos-graphql.dev/docs/guide/writing-plugins#adding-options-to-the-schemabuilder-constructor)

You may have noticed that plugins are not instantiated by the user, and therefore users can't pass options directly into your plugin when creating it. Instead, the recommended way to configure your plugin is by contributing new properties to the options object passed the the SchemaBuilder constructor. This can be done by extending the `SchemaBuilderOptions` interface.

Extending this interface will allow the user to pass in these new options when creating an instance of `SchemaBuilder`.

You can then access the options through `this.builder.options` in your plugin, with everything correctly typed:

### [Adding options when building a schema (`toSchema`)](https://pothos-graphql.dev/docs/guide/writing-plugins#adding-options-when-building-a-schema-toschema)

In some cases, your plugin may be designed for schemas that be built in different modes. For example the mocks plugin allows the schema to be built repeatedly with different sets of mocks, or the subGraph allows building a schema multiple times to generate separate subgraphs. For these cases, you can extend the options passed to `toSchema` instead:

These options can be accessed through `this.options` in your plugin:

### [Adding options to types](https://pothos-graphql.dev/docs/guide/writing-plugins#adding-options-to-types)

Each GraphQL type has it's own options interface which can be extended. For example, to extend the options for creating an Object type:

These options can then be accessed in your plugin when you receive the config for the type:

In the example above, we need to check `typeConfig.kind` to ensure that the type config is for an object. Without this check, typescript will not know that the config object is for an object, and will not let us access the property. `typeConfig.kind` corresponds to how Pothos splits up Types for its config objects, meaning that it has separate `kind`s for `Query`, `Mutation`, and `Subscription` even though these are all `Objects` in GraphQL terminology. The `typeConfig.graphqlKind` can be used to get the actual GraphQL type instead.

### [Adding options to fields](https://pothos-graphql.dev/docs/guide/writing-plugins#adding-options-to-fields)

Similar to Types, fields also have a number of interfaces that can be extended to add options to various types of fields:

Field interfaces have a few more generics than other interfaces we have looked at. These generics can be used to make the options you add more specific to the field currently being defined. It is important to copy all the generics of the interfaces as they are defined in `@pothos/core` even if you do not use the generics in your own properties. If the generics do not match, typescript won't be able to merge the definitions. You do NOT need to include the `extends` clause of the interface, if the interface extends another interface (like `FieldOptions`).

Similar to Type options, Field options will be available in the fieldConfigs in your plugin, once you check that the fieldConfig is for the correct `kind` of field.

### [Adding new methods on builder classes](https://pothos-graphql.dev/docs/guide/writing-plugins#adding-new-methods-on-builder-classes)

Adding new method to `SchemaBuilder` or one of the `FieldBuilder` classes is also done through extending interfaces. Extending these interfaces is how typescript is able to know these methods exist, even though they are not defined on the original classes.

The above is a simple example of defining a new `buildCustomObject` method that takes no arguments, and returns a reference to a new custom object type. Defining this type will not work on it's own, and we still need to define the actual implementation of this method. This might look like:

Note that the above function does NOT use an arrow function, so that the function can access `this` as a reference the the SchemaBuilder instance.

### [Wrapping resolvers to add runtime functionality](https://pothos-graphql.dev/docs/guide/writing-plugins#wrapping-resolvers-to-add-runtime-functionality)

Some plugins will need to add runtime behavior. There are a few lifecycle hooks for wrapping `resolve`, `subscribe`, and `resolveType`. These hooks will receive the function they are wrapping, along with a config object for the field or type they are associated with, and should return either the original function, or a wrapper function with the same API.

It is important to remember that resolvers can resolve values in a number of ways (normal values, promises, or even something as complicated `Promise<(Promise<T> | T)[]>`. So be careful when using a wrapper that introspected the return value of a resolve function. Plugins should only wrap resolvers when absolutely necessary.

### [Transforming a schema](https://pothos-graphql.dev/docs/guide/writing-plugins#transforming-a-schema)

For some plugins the other provided lifecycle may not be sufficiently powerful to modify the schema in all the ways a plugin may want. For example removing types from the schema (eg. the `SubGraph` plugin). In these cases, the `afterBuild` hook can be used. It receives the built schema, and is expected to return either the schema it was passed, or a completely new schema. This allows plugins to use 3rd party libraries like `graphql-tools` to arbitrarily transform schemas if desired.

### [Using SchemaTypes](https://pothos-graphql.dev/docs/guide/writing-plugins#using-schematypes)

You may have noticed that almost every interface and type in `@pothos/core` take a generic that looks like: `Types extends SchemaTypes`. This type is what allows Pothos and its plugins to share type information across the entire schema, and to incorporate user defined types into that system. These SchemaTypes are a combination of default types merged with the Types provided in the Generic parameter of the SchemaBuilder constructor, and includes a wide variety of useful types:

- Types for all the scalars
- Types for backing models used by objects and interfaces when referenced via strings
- The type used for the context and root objects
- Settings for default nullability of fields
- Any user defined types specific to plugins (more info below)

There are many ways these types can be used, but one of the most common is to access the type for the context object, so that you can correctly type a callback function for your plugin that accepts the context object.

### [Using user defined types](https://pothos-graphql.dev/docs/guide/writing-plugins#using-user-defined-types)

As mentioned above, your plugin can also contribute its own user definable types to the SchemaTypes interface. You can see examples of this in the several of the plugins including the directives and `scope-auth` plugins. Adding your own types to SchemaTypes requires extending 2 interfaces: The `UserSchemaTypes` which describes the user provided type will need to extend, and the `ExtendDefaultTypes` interface, which is used to set default values if the User does not provide their own types.

The User provided type can then be accessed using `Types['NewExampleTypes']` in any interface or type that receive `SchemaTypes` as a generic argument.

### [Request data](https://pothos-graphql.dev/docs/guide/writing-plugins#request-data)

Plugins that wrap resolvers may need to store some data that us unique the current request. In these cases your plugin can define a `createRequestData` method, and use the `requestData` method to get the data for the current request.

The shape of requestData can be defined via the second generic parameter of the `BasePlugin` class. The `requestData` method expects the context object as its only argument, which is used to uniquely identify the current request.

### [Wrapping arguments and inputs](https://pothos-graphql.dev/docs/guide/writing-plugins#wrapping-arguments-and-inputs)

The plugin API does not directly have a method for wrapping input fields, instead, the `wrapResolve` and `wrapSubscribe` methods can be used to modify the `args` object before passing it down to the original resolver.

Figuring out how to wrap inputs can be a little complex, especially when dealing with recursive inputs, and optimizing to wrap as little as possible. To help with this, Pothos has a couple of utility functions that can make this easier:

- `mapInputFields`: Used to select affected input fields and extract some configuration
- `createInputValueMapper`: Creates a mapping function that uses the result of `mapInputFields` to map inputs in an args object to new values.

The relay plugin uses these methods to decode `globalID` inputs:

Using these utilities allows moving more logic to build time (figuring out which fields need mapping) so that the runtime overhead is as small as possible.

`createInputValueMapper` may be useful for some use cases, for some plugins it may be better to create a custom mapping function, but still use the result of `mapInputFields`.

`mapInputFields` returns a map who's keys are field/argument names, and who's values are objects with the following shape:

if the `kind` is `InputObject` then the mapping object will also have a fields property with an object of the following shape:

Both the root level map, and the `fields.map` maps will only contain entries for fields where the mapping function did not return null. If the mapping function returned null for all fields, the `mapInputFields` will return null instead of returning a map to indicate no wrapping should occur

### [Removing fields and enum values](https://pothos-graphql.dev/docs/guide/writing-plugins#removing-fields-and-enum-values)

Plugins can remove fields from objects, interfaces, and input objects, and remove specific values from enums. To do this, simply return null from the corresponding on\*Config plugin hook:

Removing whole types from the schema needs to be done by transforming the schema during the `afterBuild` hook. See the `sub-graph` plugin for a more complete example of removing types.

- `builder.configStore.onTypeConfig`: Takes a type ref and a callback, and will invoke the callback with the config for the referenced type once available.

- `fieldRef.onFirstUse` Takes a callback to invoke once the config for the field is available.

- `buildCache.getTypeConfig` Gets the config for a given type after it has been passed through any modifications applied by plugins.

---

## URL: https://pothos-graphql.dev/docs/guide/deno

Title: Using Deno

URL Source: https://pothos-graphql.dev/docs/guide/deno

Markdown Content:
Pothos is compatible with [Deno](https://deno.land/), and can be used with [GraphQL Yoga](https://the-guild.dev/graphql/yoga-server) which now also supports deno!

## [Imports](https://pothos-graphql.dev/docs/guide/deno#imports)

There are a number of different ways to import Pothos, but the best option is ussually to set up [import maps](https://deno.land/manual@v1.28.3/basics/modules/import_maps) and import from [esm.sh](https://esm.sh/).

### [Import maps](https://pothos-graphql.dev/docs/guide/deno#import-maps)

```
// import_maps.json
{
  "imports": {
    // define a version of graphql, this should be shared by all graphql libraries
    "graphql": "https://esm.sh/graphql@16.6.0",
    // Marking graphql as external will all the graphql from this import_map to be used
    "graphql-yoga": "https://esm.sh/graphql-yoga?external=graphql",
    // the `*` prefix in the package name marks all depenencies (only graphql in this case) as external
    // this ensures the version of graphql defined above is used
    "@pothos/core": "https://esm.sh/*@pothos/core@3.23.1",
    // Plugins should mark all dependencies as external as well
    // this will ensure that both graphql and @pothos/core use the versions defined above
    // some plugins like validation may require additional dependencies to be added to the import map (eg. zod)
    "@pothos/plugin-relay": "https://esm.sh/*@pothos/plugin-relay@3.30.0"
  }
}
```

### [deno.json](https://pothos-graphql.dev/docs/guide/deno#denojson)

```
// deno.jsonc
{
  "importMap": "import_map.json"
}
```

## [Server](https://pothos-graphql.dev/docs/guide/deno#server)

```
// src/index.ts
import { serve } from 'https://deno.land/std@0.157.0/http/server.ts';
import { createYoga } from 'graphql-yoga';
import SchemaBuilder from '@pothos/core';

const builder = new SchemaBuilder({});

builder.queryType({
  fields: (t) => ({
    hello: t.string({
      args: {
        name: t.arg.string({}),
      },
      resolve: (_, { name }) => `hello, ${name || 'World'}`,
    }),
  }),
});

const yoga = createYoga({
  schema: builder.toSchema(),
});

serve(yoga, {
  onListen({ hostname, port }) {
    console.log(`Listening on http://${hostname}:${port}/graphql`);
  },
});
```

## [Running the app:](https://pothos-graphql.dev/docs/guide/deno#running-the-app)

`deno run --allow-net src/index.ts`

## [Without import maps](https://pothos-graphql.dev/docs/guide/deno#without-import-maps)

In some cases (like when using the deno deploy playground) you may not be able to use import maps. In this case, you can use query parameters with esm.sh to ensure that shared versions of packages are used:

```
import { serve } from 'https://deno.land/std@0.157.0/http/server.ts';
// for graphql-yoga and pothos/core 'graphql' is the most import depencency to pin
import { createYoga } from 'https://esm.sh/graphql-yoga@3.1.1?deps=graphql@16.6.0';
import SchemaBuilder from 'https://esm.sh/@pothos/core@3.23.1?deps=graphql@16.6.0';
// for pothos plugins, you should pin both 'graphql' and '@pothos/core'
import RelayPlugin from 'https://esm.sh/@pothos/plugin-relay@3.30.0?deps=graphql@16.6.0,@pothos/core@3.23.1';
```

## [The @pothos/deno package](https://pothos-graphql.dev/docs/guide/deno#the-pothosdeno-package)

The `@pothos/deno` package contains a typescript-only version of most of the pothos plugins. This is no longer the recommended way to use pothos with deno, but will continue to be published with new changes.

The files for this package are published to npm, and can be consumed from a number of CDNs. The benefit of this is that all plugins are bundled with pothos/core, and import directly so you do not need to mess with dependencies to ensure that plugins are using the correct version of pothos/core.

### [example](https://pothos-graphql.dev/docs/guide/deno#example)

```
// dependencies of @pothos/deno are imported from https://cdn.skypack.dev/{package} to ensure
// that the same version of 'graphql' is used, import other dependencies from sky pack as well
import { serve } from 'https://deno.land/std@0.157.0/http/server.ts';
import { createYoga } from 'https://cdn.skypack.dev/graphql-yoga@3.1.1';
import SchemaBuilder from 'https://esm.sh/@pothos/deno/packages/core/mod.ts';
import RelayPlugin from 'https://esm.sh/@pothos/deno/packages/plugin-relay/mod.ts';
```

Pothos uses `https://cdn.skypack.dev/graphql?dts` which can be added to an import map to import a different version of graphql.

---

## URL: https://pothos-graphql.dev/docs/guide/circular-references

Title: Circular References

URL Source: https://pothos-graphql.dev/docs/guide/circular-references

Markdown Content:
Circular references and Circular dependencies are common problem that can appear in a number of ways, and cause a variety of different issues.

Pothos has a number of built in mitigations to help avoid these issues, and tries to provide additional APIs to help with situations that can't be automatically avoided.

This guide should provide some insight into how to resolve any issues you may run into, but will hopefully not be needed very often.

Circular imports are something that can cause issues in any javascript or typescript project, but can become more common in graphql because of its interconnected nature.

When js/ts files either directly or indirectly import each other, the exports from one file will initially be undefined while executing the main body of the other. These issues often result in confusing and unrelated errors because the relevant values are often not used until much later.

Pothos mitigates this by deferring a lot of the processing until the `builder.toSchema()` method is called. As long as the file that builds the schema (calls the `toSchema` method) is not imported by any other file that defines parts of the schema, this will ensure that all types are properly imported, and types are not unexpectedly undefined.

As you can see in the example below, the references to `Post` and `User` when defining fields are wrapped inside a the `fields` function. Because this function is not executed until the schema is loaded, these types of Circular imports should work without causing any issues.

Another best practice is to avoid importing from `index.ts` files by importing from the file that defines the value directly. The easiest way to achieve this is by not exporting values from `index.ts` files.

A large portion of the Pothos API is designed to work well with circular references, but there are a few cases where typescript is unable to resolve circular references correctly.

What should work without any issues:

- Objects and interfaces referenced via a class
- Objects and interfaces referenced via a string (by proving a type mapping when creating the SchemaBuilder)
- Objects defined by plugins like Prisma that derive type information from an external source

Cases that may require some modification

- Input objects with circular references
- Object types defined with `builder.objectRef`
- Objects defined by plugins like `dataloader` that infer the Backing mode type from options passed to the type.

Defining recursive input types is described in the [input Guide](https://pothos-graphql.dev/docs/guide/inputs#recursive-inputs)

Object refs may cause issues with circular references if the refs are implemented before they are assigned to a variable. This can easily be avoided by moving the call to `ref.implement` into its own statement.

Using object refs is often a great way to avoid issues with circular references because it allows you to define the reference before defining any fields for your type. Many of the builder methods in Pothos and its plugins can be passed a type ref instead of a name:

Another easy work around is to define any fields that are causing issues separately

---

## URL: https://pothos-graphql.dev/docs/guide/troubleshooting

Title: Troubleshooting

URL Source: https://pothos-graphql.dev/docs/guide/troubleshooting

Markdown Content:
Common problems and troubleshooting steps.

This document is currently very incomplete, if you run into issues and find a useful solution, please feel free to add any tips here

1.  Ensure that typescript is using `strict` mode

2.  Move your builder types to a separate named interface

    - This will make many type errors significantly more readable

3.  Ensure you are not including any very complex objects in your `Context` type. See [https://github.com/microsoft/TypeScript/issues/45405](https://github.com/microsoft/TypeScript/issues/45405)

### [Plugin methods are not defined](https://pothos-graphql.dev/docs/guide/troubleshooting#plugin-methods-are-not-defined)

Ensure that there is only 1 version of each pothos package, and that they are both in the same root node_modules directly. Pothos plugins import classes from `@pothos/core` to add plugin specific methods to the class prototypes

### [Recieved multiple implementations for plugin](https://pothos-graphql.dev/docs/guide/troubleshooting#recieved-multiple-implementations-for-plugin)

By default, Pothos doesn't allow multiple plugin registrations with the same name. During development, it can be helpful to disable this check by setting `SchemaBuilder.allowPluginReRegistration = true`.

Keep in mind that this not only allows plugins to be updated when for example, using HMR but can also lead to unexpected behavior with plugins using the same name.

### [Refs is undefined](https://pothos-graphql.dev/docs/guide/troubleshooting#refs-is-undefined)

If you are running into issues with refs being undefined, it may be due to a circular import. Most circular imports will work correctly with pothos as long as the following conditions are true:

1.  The `builder` is defined in a file that does not import any files that use the builder (or indirectly import it).
2.  `builder.toSchema()` is called in a file that is not imported by any files that use the builder.

This is generally done by having a simple `builder.ts` that initializes the builder to export. This file can also define some core parts of your schema (the query object, scalers etc). The rest of the schema can then import the builder from `builder.ts`. A `schema.ts` file can then import all files that define parts of the schema. `schema.ts` can then call `builder.toSchema()` and export the result for use by the server.

---

## URL: https://pothos-graphql.dev/docs/guide#installing

Title: Guide

URL Source: https://pothos-graphql.dev/docs/guide

Markdown Content:
Guide

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 1: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Objects](https://pothos-graphql.dev/docs/guide/objects)[Queries, Mutations and Subscriptions](https://pothos-graphql.dev/docs/guide/queries-mutations-and-subscriptions)[SchemaBuilder](https://pothos-graphql.dev/docs/guide/schema-builder)[Fields](https://pothos-graphql.dev/docs/guide/fields)[Using args](https://pothos-graphql.dev/docs/guide/args)[Using Context](https://pothos-graphql.dev/docs/guide/context)[Input Objects](https://pothos-graphql.dev/docs/guide/inputs)[Enums](https://pothos-graphql.dev/docs/guide/enums)[Scalars](https://pothos-graphql.dev/docs/guide/scalars)[Interfaces](https://pothos-graphql.dev/docs/guide/interfaces)[Unions](https://pothos-graphql.dev/docs/guide/unions)[Using plugins](https://pothos-graphql.dev/docs/guide/using-plugins)[Inferring Types](https://pothos-graphql.dev/docs/guide/inferring-types)[File layout](https://pothos-graphql.dev/docs/guide/app-layout)[Generating client types](https://pothos-graphql.dev/docs/guide/generating-client-types)[Patterns](https://pothos-graphql.dev/docs/guide/patterns)[Printing Schemas](https://pothos-graphql.dev/docs/guide/printing-schemas)[Default nullability](https://pothos-graphql.dev/docs/guide/changing-default-nullability)[Writing plugins](https://pothos-graphql.dev/docs/guide/writing-plugins)[Using Deno](https://pothos-graphql.dev/docs/guide/deno)[Circular References](https://pothos-graphql.dev/docs/guide/circular-references)[Troubleshooting](https://pothos-graphql.dev/docs/guide/troubleshooting)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

Guide Installing

# Guide

## [Installing](https://pothos-graphql.dev/docs/guide#installing)

npm pnpm yarn bun

`npm install --save @pothos/core graphql-yoga`

## [Set up typescript](https://pothos-graphql.dev/docs/guide#set-up-typescript)

Pothos is designed to be as type-safe as possible, to ensure everything works correctly, make sure that your `tsconfig.json` has `strict` mode set to true:

```
{
  "compilerOptions": {
    "strict": true
  }
}
```

## [Create a simple schema](https://pothos-graphql.dev/docs/guide#create-a-simple-schema)

```
import SchemaBuilder from '@pothos/core';

const builder = new SchemaBuilder({});

builder.queryType({
  fields: (t) => ({
    hello: t.string({
      args: {
        name: t.arg.string(),
      },
      resolve: (parent, { name }) => `hello, ${name || 'World'}`,
    }),
  }),
});

const schema = builder.toSchema();
```

## [Create a server](https://pothos-graphql.dev/docs/guide#create-a-server)

The schema generated by Pothos is a standard graphql.js schema and can be used with several graphql server implementations including `graphql-yoga`.

```
import { createYoga } from 'graphql-yoga';
import { createServer } from 'node:http';

const yoga = createYoga({
  schema: builder.toSchema(),
});

const server = createServer(yoga);

server.listen(3000);
```

[Resources External guides, tools, and libraries created by members of the Pothos community.](https://pothos-graphql.dev/docs/resources)[Objects Guide for defining Object types in Pothos](https://pothos-graphql.dev/docs/guide/objects)

### On this page

[Installing](https://pothos-graphql.dev/docs/guide#installing)[Set up typescript](https://pothos-graphql.dev/docs/guide#set-up-typescript)[Create a simple schema](https://pothos-graphql.dev/docs/guide#create-a-simple-schema)[Create a server](https://pothos-graphql.dev/docs/guide#create-a-server)

---

## URL: https://pothos-graphql.dev/docs/guide#set-up-typescript

Title: Guide

URL Source: https://pothos-graphql.dev/docs/guide

Markdown Content:
Guide

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 1: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Objects](https://pothos-graphql.dev/docs/guide/objects)[Queries, Mutations and Subscriptions](https://pothos-graphql.dev/docs/guide/queries-mutations-and-subscriptions)[SchemaBuilder](https://pothos-graphql.dev/docs/guide/schema-builder)[Fields](https://pothos-graphql.dev/docs/guide/fields)[Using args](https://pothos-graphql.dev/docs/guide/args)[Using Context](https://pothos-graphql.dev/docs/guide/context)[Input Objects](https://pothos-graphql.dev/docs/guide/inputs)[Enums](https://pothos-graphql.dev/docs/guide/enums)[Scalars](https://pothos-graphql.dev/docs/guide/scalars)[Interfaces](https://pothos-graphql.dev/docs/guide/interfaces)[Unions](https://pothos-graphql.dev/docs/guide/unions)[Using plugins](https://pothos-graphql.dev/docs/guide/using-plugins)[Inferring Types](https://pothos-graphql.dev/docs/guide/inferring-types)[File layout](https://pothos-graphql.dev/docs/guide/app-layout)[Generating client types](https://pothos-graphql.dev/docs/guide/generating-client-types)[Patterns](https://pothos-graphql.dev/docs/guide/patterns)[Printing Schemas](https://pothos-graphql.dev/docs/guide/printing-schemas)[Default nullability](https://pothos-graphql.dev/docs/guide/changing-default-nullability)[Writing plugins](https://pothos-graphql.dev/docs/guide/writing-plugins)[Using Deno](https://pothos-graphql.dev/docs/guide/deno)[Circular References](https://pothos-graphql.dev/docs/guide/circular-references)[Troubleshooting](https://pothos-graphql.dev/docs/guide/troubleshooting)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

Guide Installing

# Guide

## [Installing](https://pothos-graphql.dev/docs/guide#installing)

npm pnpm yarn bun

`npm install --save @pothos/core graphql-yoga`

## [Set up typescript](https://pothos-graphql.dev/docs/guide#set-up-typescript)

Pothos is designed to be as type-safe as possible, to ensure everything works correctly, make sure that your `tsconfig.json` has `strict` mode set to true:

```
{
  "compilerOptions": {
    "strict": true
  }
}
```

## [Create a simple schema](https://pothos-graphql.dev/docs/guide#create-a-simple-schema)

```
import SchemaBuilder from '@pothos/core';

const builder = new SchemaBuilder({});

builder.queryType({
  fields: (t) => ({
    hello: t.string({
      args: {
        name: t.arg.string(),
      },
      resolve: (parent, { name }) => `hello, ${name || 'World'}`,
    }),
  }),
});

const schema = builder.toSchema();
```

## [Create a server](https://pothos-graphql.dev/docs/guide#create-a-server)

The schema generated by Pothos is a standard graphql.js schema and can be used with several graphql server implementations including `graphql-yoga`.

```
import { createYoga } from 'graphql-yoga';
import { createServer } from 'node:http';

const yoga = createYoga({
  schema: builder.toSchema(),
});

const server = createServer(yoga);

server.listen(3000);
```

[Resources External guides, tools, and libraries created by members of the Pothos community.](https://pothos-graphql.dev/docs/resources)[Objects Guide for defining Object types in Pothos](https://pothos-graphql.dev/docs/guide/objects)

### On this page

[Installing](https://pothos-graphql.dev/docs/guide#installing)[Set up typescript](https://pothos-graphql.dev/docs/guide#set-up-typescript)[Create a simple schema](https://pothos-graphql.dev/docs/guide#create-a-simple-schema)[Create a server](https://pothos-graphql.dev/docs/guide#create-a-server)

---

## URL: https://pothos-graphql.dev/docs/guide#create-a-simple-schema

Title: Guide

URL Source: https://pothos-graphql.dev/docs/guide

Markdown Content:
Guide

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 1: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Objects](https://pothos-graphql.dev/docs/guide/objects)[Queries, Mutations and Subscriptions](https://pothos-graphql.dev/docs/guide/queries-mutations-and-subscriptions)[SchemaBuilder](https://pothos-graphql.dev/docs/guide/schema-builder)[Fields](https://pothos-graphql.dev/docs/guide/fields)[Using args](https://pothos-graphql.dev/docs/guide/args)[Using Context](https://pothos-graphql.dev/docs/guide/context)[Input Objects](https://pothos-graphql.dev/docs/guide/inputs)[Enums](https://pothos-graphql.dev/docs/guide/enums)[Scalars](https://pothos-graphql.dev/docs/guide/scalars)[Interfaces](https://pothos-graphql.dev/docs/guide/interfaces)[Unions](https://pothos-graphql.dev/docs/guide/unions)[Using plugins](https://pothos-graphql.dev/docs/guide/using-plugins)[Inferring Types](https://pothos-graphql.dev/docs/guide/inferring-types)[File layout](https://pothos-graphql.dev/docs/guide/app-layout)[Generating client types](https://pothos-graphql.dev/docs/guide/generating-client-types)[Patterns](https://pothos-graphql.dev/docs/guide/patterns)[Printing Schemas](https://pothos-graphql.dev/docs/guide/printing-schemas)[Default nullability](https://pothos-graphql.dev/docs/guide/changing-default-nullability)[Writing plugins](https://pothos-graphql.dev/docs/guide/writing-plugins)[Using Deno](https://pothos-graphql.dev/docs/guide/deno)[Circular References](https://pothos-graphql.dev/docs/guide/circular-references)[Troubleshooting](https://pothos-graphql.dev/docs/guide/troubleshooting)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

Guide Installing

# Guide

## [Installing](https://pothos-graphql.dev/docs/guide#installing)

npm pnpm yarn bun

`npm install --save @pothos/core graphql-yoga`

## [Set up typescript](https://pothos-graphql.dev/docs/guide#set-up-typescript)

Pothos is designed to be as type-safe as possible, to ensure everything works correctly, make sure that your `tsconfig.json` has `strict` mode set to true:

```
{
  "compilerOptions": {
    "strict": true
  }
}
```

## [Create a simple schema](https://pothos-graphql.dev/docs/guide#create-a-simple-schema)

```
import SchemaBuilder from '@pothos/core';

const builder = new SchemaBuilder({});

builder.queryType({
  fields: (t) => ({
    hello: t.string({
      args: {
        name: t.arg.string(),
      },
      resolve: (parent, { name }) => `hello, ${name || 'World'}`,
    }),
  }),
});

const schema = builder.toSchema();
```

## [Create a server](https://pothos-graphql.dev/docs/guide#create-a-server)

The schema generated by Pothos is a standard graphql.js schema and can be used with several graphql server implementations including `graphql-yoga`.

```
import { createYoga } from 'graphql-yoga';
import { createServer } from 'node:http';

const yoga = createYoga({
  schema: builder.toSchema(),
});

const server = createServer(yoga);

server.listen(3000);
```

[Resources External guides, tools, and libraries created by members of the Pothos community.](https://pothos-graphql.dev/docs/resources)[Objects Guide for defining Object types in Pothos](https://pothos-graphql.dev/docs/guide/objects)

### On this page

[Installing](https://pothos-graphql.dev/docs/guide#installing)[Set up typescript](https://pothos-graphql.dev/docs/guide#set-up-typescript)[Create a simple schema](https://pothos-graphql.dev/docs/guide#create-a-simple-schema)[Create a server](https://pothos-graphql.dev/docs/guide#create-a-server)

---

## URL: https://pothos-graphql.dev/docs/guide#create-a-server

Title: Guide

URL Source: https://pothos-graphql.dev/docs/guide

Markdown Content:
Guide

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 1: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Objects](https://pothos-graphql.dev/docs/guide/objects)[Queries, Mutations and Subscriptions](https://pothos-graphql.dev/docs/guide/queries-mutations-and-subscriptions)[SchemaBuilder](https://pothos-graphql.dev/docs/guide/schema-builder)[Fields](https://pothos-graphql.dev/docs/guide/fields)[Using args](https://pothos-graphql.dev/docs/guide/args)[Using Context](https://pothos-graphql.dev/docs/guide/context)[Input Objects](https://pothos-graphql.dev/docs/guide/inputs)[Enums](https://pothos-graphql.dev/docs/guide/enums)[Scalars](https://pothos-graphql.dev/docs/guide/scalars)[Interfaces](https://pothos-graphql.dev/docs/guide/interfaces)[Unions](https://pothos-graphql.dev/docs/guide/unions)[Using plugins](https://pothos-graphql.dev/docs/guide/using-plugins)[Inferring Types](https://pothos-graphql.dev/docs/guide/inferring-types)[File layout](https://pothos-graphql.dev/docs/guide/app-layout)[Generating client types](https://pothos-graphql.dev/docs/guide/generating-client-types)[Patterns](https://pothos-graphql.dev/docs/guide/patterns)[Printing Schemas](https://pothos-graphql.dev/docs/guide/printing-schemas)[Default nullability](https://pothos-graphql.dev/docs/guide/changing-default-nullability)[Writing plugins](https://pothos-graphql.dev/docs/guide/writing-plugins)[Using Deno](https://pothos-graphql.dev/docs/guide/deno)[Circular References](https://pothos-graphql.dev/docs/guide/circular-references)[Troubleshooting](https://pothos-graphql.dev/docs/guide/troubleshooting)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

Guide Installing

# Guide

## [Installing](https://pothos-graphql.dev/docs/guide#installing)

npm pnpm yarn bun

`npm install --save @pothos/core graphql-yoga`

## [Set up typescript](https://pothos-graphql.dev/docs/guide#set-up-typescript)

Pothos is designed to be as type-safe as possible, to ensure everything works correctly, make sure that your `tsconfig.json` has `strict` mode set to true:

```
{
  "compilerOptions": {
    "strict": true
  }
}
```

## [Create a simple schema](https://pothos-graphql.dev/docs/guide#create-a-simple-schema)

```
import SchemaBuilder from '@pothos/core';

const builder = new SchemaBuilder({});

builder.queryType({
  fields: (t) => ({
    hello: t.string({
      args: {
        name: t.arg.string(),
      },
      resolve: (parent, { name }) => `hello, ${name || 'World'}`,
    }),
  }),
});

const schema = builder.toSchema();
```

## [Create a server](https://pothos-graphql.dev/docs/guide#create-a-server)

The schema generated by Pothos is a standard graphql.js schema and can be used with several graphql server implementations including `graphql-yoga`.

```
import { createYoga } from 'graphql-yoga';
import { createServer } from 'node:http';

const yoga = createYoga({
  schema: builder.toSchema(),
});

const server = createServer(yoga);

server.listen(3000);
```

[Resources External guides, tools, and libraries created by members of the Pothos community.](https://pothos-graphql.dev/docs/resources)[Objects Guide for defining Object types in Pothos](https://pothos-graphql.dev/docs/guide/objects)

### On this page

[Installing](https://pothos-graphql.dev/docs/guide#installing)[Set up typescript](https://pothos-graphql.dev/docs/guide#set-up-typescript)[Create a simple schema](https://pothos-graphql.dev/docs/guide#create-a-simple-schema)[Create a server](https://pothos-graphql.dev/docs/guide#create-a-server)

---

## URL: https://pothos-graphql.dev/docs/plugins/federation

Title: Federation plugin

URL Source: https://pothos-graphql.dev/docs/plugins/federation

Markdown Content:
A plugin for building subGraphs that are compatible with [Apollo Federation 2](https://www.apollographql.com/docs/federation/).

This page will describe the basics of the Pothos API for federation, but will not cover detailed information on how federation works, or what all the terms on this page mean. For more general information on federation, see the [official docs](https://www.apollographql.com/docs/federation/v2/)

### [Install](https://pothos-graphql.dev/docs/plugins/federation#install)

You will need to install the plugin, as well as the directives plugin (`@pothos/plugin-directives`) and `@apollo/subgraph`

You will likely want to install @apollo/server as well, but it is not required if you want to use a different server

### [Setup](https://pothos-graphql.dev/docs/plugins/federation#setup)

### [Defining entities](https://pothos-graphql.dev/docs/plugins/federation#defining-entities)

Defining entities for you schema is a 2 step process. First you will need to define an object type as you would normally, then you can convert that object type to an entity by providing a `key` (or `keys`), and a method to load that entity.

`keys` are defined using `builder.selection`. This method _MUST_ be called with a generic argument that defines the types for any fields that are part of the key. `key` may also be an array. `resolveReference` will be called with the type used by the `key` selection.

Entities are Object types that may be extended with or returned by fields in other services. `builder.asEntity` describes how the Entity will be loaded when used by another services. The `key` select (or selection) should use the types of scalars your server will produce for inputs. For example, Apollo server will convert all ID fields to `string`s, even if resolvers in other services returns IDs as numbers.

### [Extending external entities](https://pothos-graphql.dev/docs/plugins/federation#extending-external-entities)

External entities can be extended by calling `builder.externalRef`, and then calling implement on the returned ref.

`builder.externalRef` takes the name of the entity, a selection (using `builder.selection`, just like a `key` on an entity object), and a resolve method that loads an object given a `key`. The return type of the resolver is used as the backing type for the ref, and will be the type of the `parent` arg when defining fields for this type. The `key` also describes what fields will be selected from another service to use as the `parent` object in resolvers for fields added when implementing the `externalRef`.

To set the `resolvable` property of an external field to `false`, can use `builder.keyDirective`:

### [Adding a provides directive](https://pothos-graphql.dev/docs/plugins/federation#adding-a-provides-directive)

To add a `@provides` directive, you will need to implement the Parent type of the field being provided as an external ref, and then use the `.provides` method of the returned ref when defining the field that will have the `@provides` directive. The provided field must be listed as an `externalField` in the external type.

### [Building your schema and starting a server](https://pothos-graphql.dev/docs/plugins/federation#building-your-schema-and-starting-a-server)

For a functional example that combines multiple graphs built with Pothos into a single schema see [https://github.com/hayes/pothos/tree/main/packages/plugin-federation/tests/example](https://github.com/hayes/pothos/tree/main/packages/plugin-federation/tests/example)

### [Printing the schema](https://pothos-graphql.dev/docs/plugins/federation#printing-the-schema)

If you are printing the schema as a string for any reason, and then using the printed schema for Apollo Federation(submitting if using Managed Federation, or composing manually with `rover`), you must use `printSubgraphSchema`(from `@apollo/subgraph`) or another compatible way of printing the schema(that includes directives) in order for it to work.

### [Field directives directives](https://pothos-graphql.dev/docs/plugins/federation#field-directives-directives)

Several federation directives can be configured directly when defining a field includes `@shareable`, `@tag`, `@inaccessible`, and `@override`.

For more details on these directives, see the official Federation documentation.

### [interface entities and @interfaceObject](https://pothos-graphql.dev/docs/plugins/federation#interface-entities-and-interfaceobject)

Federation 2.3 introduces new features for federating interface definitions.

You can now pass interfaces to `asEntity` to defined keys for an interface:

You can also extend interfaces from another subGraph by creating an `interfaceObject`:

See federation documentation for more details on `interfaceObject`s

### [composeDirective =](https://pothos-graphql.dev/docs/plugins/federation#composedirective-)

You can apply the `composeDirective` directive when building the subgraph schema:

---

## URL: https://pothos-graphql.dev/docs/migrations/giraphql-pothos

Title: Giraphql to Pothos

URL Source: https://pothos-graphql.dev/docs/migrations/giraphql-pothos

Markdown Content:
[Migrating from GiraphQL to Pothos](https://pothos-graphql.dev/docs/migrations/giraphql-pothos#migrating-from-giraphql-to-pothos)

---

As of 3.0 GiraphQL has been renamed to Pothos. The primary motivation for this rename is to make this library and associated projects, guides, and other content to be more discoverable. GiraphQL is not visually distinct from GraphQL, and has often been interpreted as a typo. Search engines tend to auto-correct the name to GraphQL, making it hard to search for.

## [Changes for consumers of GiraphQL](https://pothos-graphql.dev/docs/migrations/giraphql-pothos#changes-for-consumers-of-giraphql)

- All packages have been moved from the `@giraphql/*` scope to `@pothos/*` scope.
- The `GiraphQLSchemaTypes` global typescript scope has been renamed to `PothosSchemaTypes`
- Exported types prefixed with `GiraphQL` have had that prefix replaced with `Pothos`

For the most part, the easiest way to upgrade is by doing a CASE SENSITIVE search and replace of `giraphql` ->`pothos` and `GiraphQL` ->`Pothos`. The only non-documentation change between the latest version of GiraphQL and the initial version of Pothos (`v3.0.0`) are renaming of types and packages.

## [Plugin specific changes](https://pothos-graphql.dev/docs/migrations/giraphql-pothos#plugin-specific-changes)

### [Prisma plugin](https://pothos-graphql.dev/docs/migrations/giraphql-pothos#prisma-plugin)

- The generator/provider for prisma types has been renamed to `prisma-pothos-types`.

You will need to update your prisma schema to use the new provider:

```
generator pothos {
  provider = "prisma-pothos-types"
}
```

## [For plugin authors](https://pothos-graphql.dev/docs/migrations/giraphql-pothos#for-plugin-authors)

- Some `extensions` fields in the build schemas have been renamed. Specifically:

- `giraphQLOptions` has been renamed to `pothosOptions`

- `giraphQLConfig` has been renamed to `pothosConfig`

---

## URL: https://pothos-graphql.dev/docs/migrations/v2

Title: v2.0

URL Source: https://pothos-graphql.dev/docs/migrations/v2

Markdown Content:
The 2.0 release was mostly focused around re-designing the plugin system so it could be properly documented, and made available for broader adoption. The previous plugin system allowed plugins to use the FieldWrapper base class to wrap fields. Unfortunately the overhead of this wrapping strategy was significantly higher than expected, and could not be optimized in a way that justified the conveniences it provided.

### [Auth plugin](https://pothos-graphql.dev/docs/migrations/v2#auth-plugin)

The auth plugin has been replaced by a new `scope-auth` plugin. Unfortunately due to the performance problems with the original field wrapping API, the auth plugin had to be re-designed, and maintaining the existing API at the cost of significant performance overhead did not seem justified.

Any existing usage of the `auth` plugin will need to be replaced with the new `scope-auth` plugin. The API of the new `scope-auth` plugin is substantially different, and the specifics of the migration will depend on the exact usage of the original auth plugin. Documentation on the new plugin can be found [here](https://pothos-graphql.dev/docs/plugins/scope-auth).

### [Plugin names](https://pothos-graphql.dev/docs/migrations/v2#plugin-names)

Plugin names have been normalized, and are now exported as the default export of the plugin packages.

Change:

### [Plugin Order](https://pothos-graphql.dev/docs/migrations/v2#plugin-order)

The old plugin API did not make strong guarantees about the order in which plugin hooks would be executed. Plugins are now always triggered in reverse order. The most critical plugins (like `auth-scope`) should appear first in the list of plugins. This ensures that any modifications made by other plugins are applied first, and lets the more important plugins be at the top of the call stack when resolving fields.

### [InputFieldBuilder.bool and InputFieldBuilder.boolList](https://pothos-graphql.dev/docs/migrations/v2#inputfieldbuilderbool-and-inputfieldbuilderboollist)

The `bool` alias on `InputFieldBuilder` has been removed, as it was inconsistent with the other field builders and general naming convention of other methods. Usage of this method should be converted to the canonical `boolean` and `booleanList` methods.

Change:

### [args on "exposed" fields](https://pothos-graphql.dev/docs/migrations/v2#args-on-exposed-fields)

Fields defined with the `expose` helpers no longer accept `args` since they also do not have a resolver.

### [Plugin API](https://pothos-graphql.dev/docs/migrations/v2#plugin-api)

The Plugin API has been completely re-designed and is now [documented here](https://pothos-graphql.dev/docs/guide/writing-plugins). new instances of plugins are now instantiated each time `toSchema` is called on the `SchemaBuilder`, rather than being tied to the lifetime of the `SchemaBuilder` itself.

- Lots of new documentation
- New scope-auth plugin
- New directives plugin
- New plugin API
- Significant performance improvements in smart-subscriptions and scope-auth plugins

---

## URL: https://pothos-graphql.dev/docs/migrations#migration-to-pothos-from-other-graphql-libraries

Title: Migrations

URL Source: https://pothos-graphql.dev/docs/migrations

Markdown Content:

- [3.\* to (4.0)](https://pothos-graphql.dev/docs/migrations/v4)
- [GiraphQL (2.\*) to Pothos (3.0)](https://pothos-graphql.dev/docs/migrations/giraphql-pothos)
- [1.\* to 2.0](https://pothos-graphql.dev/docs/migrations/v2)

## [Migration to Pothos from other GraphQL libraries](https://pothos-graphql.dev/docs/migrations#migration-to-pothos-from-other-graphql-libraries)

Official migration tools are currently a work in progress, and we are hoping to make incremental migration from a number of common setups much easier in the near future. For now there are a few tools that may be helpful while the official tooling for migrations is being developed.

- [Nexus to Pothos codemod](https://github.com/villesau/nexus-to-pothos-codemod)

This 3rd party code-mod aims to transform all the nexus types, queries and mutations to Pothos equivalents. This codemod will still require some manual adjustments to get everything working correctly, but can be a huge help in the migration process.

- [Pothos Generator](https://github.com/hayes/pothos/tree/main/packages/converter)

This is an undocumented CLI that can convert a schema into valid Pothos code. Resolvers are all placeholders that throw errors, so this is not quite as useful as it sounds, but can be helpful, especially for generating input types.

---

## URL: https://pothos-graphql.dev/docs/design#type-system

Title: Design

URL Source: https://pothos-graphql.dev/docs/design

Markdown Content:
[Type System](https://pothos-graphql.dev/docs/design#type-system)

---

The type system that powers most of the Pothos type checking has 2 components. The first is the SchemaTypes type param passed into the SchemaBuilder. This allows a shared set of types to be reused throughout the schema, and is responsible for providing type information for shared types like the [Context](https://pothos-graphql.dev/docs/guide/context) object, and any Object, Interface, or Scalar types that you want to reference by name (as a string). Having all type information in a single object can be convenient at times, but with large schemas, can become unwieldy.

To support a number of additional use cases, including Unions and Enums, large schemas, and plugins that use extract type information from other sources (eg the Prisma, or the simple-objects plugin), Pothos has another way of passing around type information. This system is based in `Ref` objects that contain the type information it represents. Every builder method for creating a type or a field returns a `Ref` object.

Using Ref objects allows us to separate the type information from the implementation, and allows for a more modular design.

---

## URL: https://pothos-graphql.dev/docs/plugins/add-graphql#install

Title: Add GraphQL plugin

URL Source: https://pothos-graphql.dev/docs/plugins/add-graphql

Markdown Content:
Add GraphQL plugin

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 1: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Add GraphQL plugin](https://pothos-graphql.dev/docs/plugins/add-graphql)[Complexity plugin](https://pothos-graphql.dev/docs/plugins/complexity)[Dataloader plugin](https://pothos-graphql.dev/docs/plugins/dataloader)[Directive plugin](https://pothos-graphql.dev/docs/plugins/directives)[Drizzle plugin](https://pothos-graphql.dev/docs/plugins/drizzle)[Errors plugin](https://pothos-graphql.dev/docs/plugins/errors)[Federation plugin](https://pothos-graphql.dev/docs/plugins/federation)[Mocks plugin](https://pothos-graphql.dev/docs/plugins/mocks)[Relay plugin](https://pothos-graphql.dev/docs/plugins/relay)[Auth plugin](https://pothos-graphql.dev/docs/plugins/scope-auth)[Simple objects plugin](https://pothos-graphql.dev/docs/plugins/simple-objects)[Smart subscriptions plugin](https://pothos-graphql.dev/docs/plugins/smart-subscriptions)[SubGraph plugin](https://pothos-graphql.dev/docs/plugins/sub-graph)[Tracing plugin](https://pothos-graphql.dev/docs/plugins/tracing)[With-Input plugin](https://pothos-graphql.dev/docs/plugins/with-input)[Zod Validation plugin](https://pothos-graphql.dev/docs/plugins/zod)

[Prisma](https://pothos-graphql.dev/docs/plugins/prisma)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

Add GraphQL plugin Install

[Plugins](https://pothos-graphql.dev/docs/plugins)

# Add GraphQL plugin

This plugin makes it easy to integrate GraphQL types from existing schemas into your Pothos API

It can be used for incremental migrations from nexus, graphql-tools, or any other JS/TS executable schema.

## [Install](https://pothos-graphql.dev/docs/plugins/add-graphql#install)

npm pnpm yarn bun

`npm install --save @pothos/plugin-add-graphql`

## [Setup](https://pothos-graphql.dev/docs/plugins/add-graphql#setup)

```
import AddGraphQLPlugin from '@pothos/plugin-add-graphql';

const builder = new SchemaBuilder({
  plugins: [AddGraphQLPlugin],
});
```

## [Usage](https://pothos-graphql.dev/docs/plugins/add-graphql#usage)

There are 2 ways you can reference existing types.

- Adding types (or a whole external schema) when setting up the builder
- Adding types as Refs using new builder methods

### [Adding types when creating your builder](https://pothos-graphql.dev/docs/plugins/add-graphql#adding-types-when-creating-your-builder)

Adding types to the builder will automatically include the types in your schema when it's built. Types will only be added if no existing type of the same name is added to the builder before building the schema.

Adding types recursively adds any other types that the added type depends in it's fields, interfaces, or union members.

```
import { existingSchema } from './existing-schema-location';

const builder = new SchemaBuilder({
  plugins: [AddGraphQLPlugin],
  add: {
    // You can add individual types
    // This accepts Any GraphQLNamedType (Objects, Interface, Unions, Enums, Scalars, and InputObjects)
    types: [existingSchema.getType('User'), existingSchema.getType('Post')],
    // Or you can add an entire external schema
    schema: existingSchema,
  },
});
```

Adding types by themselves isn't very useful, so you'll probably want to be able to reference them when defining fields in your schema. To do this, you can add them to the builders generic Types.

This currently only works for `Object`, `Interface`, and `Scalar` types. For other types, use the builder methods below to create refs to the added types.

```
import { existingSchema } from './existing-schema-location';

const builder = new SchemaBuilder<{
  Objects: {
    User: UserType;
  };
  Interfaces: {
    ExampleInterface: { id: string };
  };
  Scalars: {
    DateTime: {
      Output: Date;
      Input: Date;
    };
  };
}>({
  plugins: [AddGraphQLPlugin],
  add: {
    types: [
      existingSchema.getType('User'),
      existingSchema.getType('ExampleInterface'),
      existingSchema.getType('DateTime'),
    ],
  },
});

builder.queryFields((t) => ({
  user: t.field({ type: 'User', resolve: () => getUser() }),
  exampleInterface: t.field({ type: 'ExampleInterface', resolve: () => getThings() }),
  now: t.field({ type: 'DateTime', resolve: () => new Date() }),
}));
```

### [Adding types using builder methods](https://pothos-graphql.dev/docs/plugins/add-graphql#adding-types-using-builder-methods)

#### [Objects](https://pothos-graphql.dev/docs/plugins/add-graphql#objects)

```
// Passing in a generic type is recommended to ensure type-safety
const UserRef = builder.addGraphQLObject<UserType>(
  existingSchema.getType('User') as GraphQLObjectType,
  {
    // Optionally you can override the types name
    name: 'AddedUser',
    // You can also pass in any other options you can define for normal object types
    description: 'This type represents Users',
  },
);

const PostRef = builder.addGraphQLObject<{
  id: string;
  title: string;
  content: string;
}>(existingSchema.getType('Post') as GraphQLObjectType, {
  fields: (t) => ({
    // remove existing title field from type
    title: null,
    // add new titleField
    postTitle: t.exposeString('title'),
  }),
});
```

You can then use the returned references when defining fields:

```
builder.queryFields((t) => ({
  posts: t.field({
    type: [PostRef],
    resolve: () => loadPosts(),
  }),
}));
```

### [Interfaces](https://pothos-graphql.dev/docs/plugins/add-graphql#interfaces)

```
const NodeRef = builder.addGraphQLInterface<NodeShape>(
  existingSchema.getType('Node') as GraphQLInterfaceType,
  {
    // interface options
  },
);
```

### [Unions](https://pothos-graphql.dev/docs/plugins/add-graphql#unions)

```
const SearchResult = builder.addGraphQLUnion<User | Post>(
  existingSchema.getType('SearchResult') as GraphQLUnionType,
  {
    // union options
  },
);
```

### [Enums](https://pothos-graphql.dev/docs/plugins/add-graphql#enums)

```
const OrderBy = builder.addGraphQLEnum<'Asc' | 'Desc'>(
  existingSchema.getType('OrderBy') as GraphQLEnumType,
  {
    // enum options
  },
);
```

### [Input objects](https://pothos-graphql.dev/docs/plugins/add-graphql#input-objects)

```
const PostFilter = builder.addGraphQLInput<{ title?: string, tags? string[] }>(
  existingSchema.getType('PostFilter') as GraphQLInputObjectType,
  {
    // input options
  },
);
```

### [Scalars](https://pothos-graphql.dev/docs/plugins/add-graphql#scalars)

This plugin does not add a new method for scalars, because Pothos already has a method for adding existing scalar types.

```
builder.addScalarType('DateTime', existingSchema.getType('DateTime') as GraphQLScalar, {
  // scalar options
});
```

[Plugins List of plugins for Pothos](https://pothos-graphql.dev/docs/plugins)[Complexity plugin Complexity plugin docs for Pothos](https://pothos-graphql.dev/docs/plugins/complexity)

### On this page

[Install](https://pothos-graphql.dev/docs/plugins/add-graphql#install)[Setup](https://pothos-graphql.dev/docs/plugins/add-graphql#setup)[Usage](https://pothos-graphql.dev/docs/plugins/add-graphql#usage)[Adding types when creating your builder](https://pothos-graphql.dev/docs/plugins/add-graphql#adding-types-when-creating-your-builder)[Adding types using builder methods](https://pothos-graphql.dev/docs/plugins/add-graphql#adding-types-using-builder-methods)[Objects](https://pothos-graphql.dev/docs/plugins/add-graphql#objects)[Interfaces](https://pothos-graphql.dev/docs/plugins/add-graphql#interfaces)[Unions](https://pothos-graphql.dev/docs/plugins/add-graphql#unions)[Enums](https://pothos-graphql.dev/docs/plugins/add-graphql#enums)[Input objects](https://pothos-graphql.dev/docs/plugins/add-graphql#input-objects)[Scalars](https://pothos-graphql.dev/docs/plugins/add-graphql#scalars)

---

## URL: https://pothos-graphql.dev/docs/plugins/add-graphql#setup

Title: Add GraphQL plugin

URL Source: https://pothos-graphql.dev/docs/plugins/add-graphql

Markdown Content:
Add GraphQL plugin

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 1: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Add GraphQL plugin](https://pothos-graphql.dev/docs/plugins/add-graphql)[Complexity plugin](https://pothos-graphql.dev/docs/plugins/complexity)[Dataloader plugin](https://pothos-graphql.dev/docs/plugins/dataloader)[Directive plugin](https://pothos-graphql.dev/docs/plugins/directives)[Drizzle plugin](https://pothos-graphql.dev/docs/plugins/drizzle)[Errors plugin](https://pothos-graphql.dev/docs/plugins/errors)[Federation plugin](https://pothos-graphql.dev/docs/plugins/federation)[Mocks plugin](https://pothos-graphql.dev/docs/plugins/mocks)[Relay plugin](https://pothos-graphql.dev/docs/plugins/relay)[Auth plugin](https://pothos-graphql.dev/docs/plugins/scope-auth)[Simple objects plugin](https://pothos-graphql.dev/docs/plugins/simple-objects)[Smart subscriptions plugin](https://pothos-graphql.dev/docs/plugins/smart-subscriptions)[SubGraph plugin](https://pothos-graphql.dev/docs/plugins/sub-graph)[Tracing plugin](https://pothos-graphql.dev/docs/plugins/tracing)[With-Input plugin](https://pothos-graphql.dev/docs/plugins/with-input)[Zod Validation plugin](https://pothos-graphql.dev/docs/plugins/zod)

[Prisma](https://pothos-graphql.dev/docs/plugins/prisma)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

Add GraphQL plugin Install

[Plugins](https://pothos-graphql.dev/docs/plugins)

# Add GraphQL plugin

This plugin makes it easy to integrate GraphQL types from existing schemas into your Pothos API

It can be used for incremental migrations from nexus, graphql-tools, or any other JS/TS executable schema.

## [Install](https://pothos-graphql.dev/docs/plugins/add-graphql#install)

npm pnpm yarn bun

`npm install --save @pothos/plugin-add-graphql`

## [Setup](https://pothos-graphql.dev/docs/plugins/add-graphql#setup)

```
import AddGraphQLPlugin from '@pothos/plugin-add-graphql';

const builder = new SchemaBuilder({
  plugins: [AddGraphQLPlugin],
});
```

## [Usage](https://pothos-graphql.dev/docs/plugins/add-graphql#usage)

There are 2 ways you can reference existing types.

- Adding types (or a whole external schema) when setting up the builder
- Adding types as Refs using new builder methods

### [Adding types when creating your builder](https://pothos-graphql.dev/docs/plugins/add-graphql#adding-types-when-creating-your-builder)

Adding types to the builder will automatically include the types in your schema when it's built. Types will only be added if no existing type of the same name is added to the builder before building the schema.

Adding types recursively adds any other types that the added type depends in it's fields, interfaces, or union members.

```
import { existingSchema } from './existing-schema-location';

const builder = new SchemaBuilder({
  plugins: [AddGraphQLPlugin],
  add: {
    // You can add individual types
    // This accepts Any GraphQLNamedType (Objects, Interface, Unions, Enums, Scalars, and InputObjects)
    types: [existingSchema.getType('User'), existingSchema.getType('Post')],
    // Or you can add an entire external schema
    schema: existingSchema,
  },
});
```

Adding types by themselves isn't very useful, so you'll probably want to be able to reference them when defining fields in your schema. To do this, you can add them to the builders generic Types.

This currently only works for `Object`, `Interface`, and `Scalar` types. For other types, use the builder methods below to create refs to the added types.

```
import { existingSchema } from './existing-schema-location';

const builder = new SchemaBuilder<{
  Objects: {
    User: UserType;
  };
  Interfaces: {
    ExampleInterface: { id: string };
  };
  Scalars: {
    DateTime: {
      Output: Date;
      Input: Date;
    };
  };
}>({
  plugins: [AddGraphQLPlugin],
  add: {
    types: [
      existingSchema.getType('User'),
      existingSchema.getType('ExampleInterface'),
      existingSchema.getType('DateTime'),
    ],
  },
});

builder.queryFields((t) => ({
  user: t.field({ type: 'User', resolve: () => getUser() }),
  exampleInterface: t.field({ type: 'ExampleInterface', resolve: () => getThings() }),
  now: t.field({ type: 'DateTime', resolve: () => new Date() }),
}));
```

### [Adding types using builder methods](https://pothos-graphql.dev/docs/plugins/add-graphql#adding-types-using-builder-methods)

#### [Objects](https://pothos-graphql.dev/docs/plugins/add-graphql#objects)

```
// Passing in a generic type is recommended to ensure type-safety
const UserRef = builder.addGraphQLObject<UserType>(
  existingSchema.getType('User') as GraphQLObjectType,
  {
    // Optionally you can override the types name
    name: 'AddedUser',
    // You can also pass in any other options you can define for normal object types
    description: 'This type represents Users',
  },
);

const PostRef = builder.addGraphQLObject<{
  id: string;
  title: string;
  content: string;
}>(existingSchema.getType('Post') as GraphQLObjectType, {
  fields: (t) => ({
    // remove existing title field from type
    title: null,
    // add new titleField
    postTitle: t.exposeString('title'),
  }),
});
```

You can then use the returned references when defining fields:

```
builder.queryFields((t) => ({
  posts: t.field({
    type: [PostRef],
    resolve: () => loadPosts(),
  }),
}));
```

### [Interfaces](https://pothos-graphql.dev/docs/plugins/add-graphql#interfaces)

```
const NodeRef = builder.addGraphQLInterface<NodeShape>(
  existingSchema.getType('Node') as GraphQLInterfaceType,
  {
    // interface options
  },
);
```

### [Unions](https://pothos-graphql.dev/docs/plugins/add-graphql#unions)

```
const SearchResult = builder.addGraphQLUnion<User | Post>(
  existingSchema.getType('SearchResult') as GraphQLUnionType,
  {
    // union options
  },
);
```

### [Enums](https://pothos-graphql.dev/docs/plugins/add-graphql#enums)

```
const OrderBy = builder.addGraphQLEnum<'Asc' | 'Desc'>(
  existingSchema.getType('OrderBy') as GraphQLEnumType,
  {
    // enum options
  },
);
```

### [Input objects](https://pothos-graphql.dev/docs/plugins/add-graphql#input-objects)

```
const PostFilter = builder.addGraphQLInput<{ title?: string, tags? string[] }>(
  existingSchema.getType('PostFilter') as GraphQLInputObjectType,
  {
    // input options
  },
);
```

### [Scalars](https://pothos-graphql.dev/docs/plugins/add-graphql#scalars)

This plugin does not add a new method for scalars, because Pothos already has a method for adding existing scalar types.

```
builder.addScalarType('DateTime', existingSchema.getType('DateTime') as GraphQLScalar, {
  // scalar options
});
```

[Plugins List of plugins for Pothos](https://pothos-graphql.dev/docs/plugins)[Complexity plugin Complexity plugin docs for Pothos](https://pothos-graphql.dev/docs/plugins/complexity)

### On this page

[Install](https://pothos-graphql.dev/docs/plugins/add-graphql#install)[Setup](https://pothos-graphql.dev/docs/plugins/add-graphql#setup)[Usage](https://pothos-graphql.dev/docs/plugins/add-graphql#usage)[Adding types when creating your builder](https://pothos-graphql.dev/docs/plugins/add-graphql#adding-types-when-creating-your-builder)[Adding types using builder methods](https://pothos-graphql.dev/docs/plugins/add-graphql#adding-types-using-builder-methods)[Objects](https://pothos-graphql.dev/docs/plugins/add-graphql#objects)[Interfaces](https://pothos-graphql.dev/docs/plugins/add-graphql#interfaces)[Unions](https://pothos-graphql.dev/docs/plugins/add-graphql#unions)[Enums](https://pothos-graphql.dev/docs/plugins/add-graphql#enums)[Input objects](https://pothos-graphql.dev/docs/plugins/add-graphql#input-objects)[Scalars](https://pothos-graphql.dev/docs/plugins/add-graphql#scalars)

---

## URL: https://pothos-graphql.dev/docs/plugins/add-graphql#usage

Title: Add GraphQL plugin

URL Source: https://pothos-graphql.dev/docs/plugins/add-graphql

Markdown Content:
Add GraphQL plugin

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 1: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Add GraphQL plugin](https://pothos-graphql.dev/docs/plugins/add-graphql)[Complexity plugin](https://pothos-graphql.dev/docs/plugins/complexity)[Dataloader plugin](https://pothos-graphql.dev/docs/plugins/dataloader)[Directive plugin](https://pothos-graphql.dev/docs/plugins/directives)[Drizzle plugin](https://pothos-graphql.dev/docs/plugins/drizzle)[Errors plugin](https://pothos-graphql.dev/docs/plugins/errors)[Federation plugin](https://pothos-graphql.dev/docs/plugins/federation)[Mocks plugin](https://pothos-graphql.dev/docs/plugins/mocks)[Relay plugin](https://pothos-graphql.dev/docs/plugins/relay)[Auth plugin](https://pothos-graphql.dev/docs/plugins/scope-auth)[Simple objects plugin](https://pothos-graphql.dev/docs/plugins/simple-objects)[Smart subscriptions plugin](https://pothos-graphql.dev/docs/plugins/smart-subscriptions)[SubGraph plugin](https://pothos-graphql.dev/docs/plugins/sub-graph)[Tracing plugin](https://pothos-graphql.dev/docs/plugins/tracing)[With-Input plugin](https://pothos-graphql.dev/docs/plugins/with-input)[Zod Validation plugin](https://pothos-graphql.dev/docs/plugins/zod)

[Prisma](https://pothos-graphql.dev/docs/plugins/prisma)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

Add GraphQL plugin Install

[Plugins](https://pothos-graphql.dev/docs/plugins)

# Add GraphQL plugin

This plugin makes it easy to integrate GraphQL types from existing schemas into your Pothos API

It can be used for incremental migrations from nexus, graphql-tools, or any other JS/TS executable schema.

## [Install](https://pothos-graphql.dev/docs/plugins/add-graphql#install)

npm pnpm yarn bun

`npm install --save @pothos/plugin-add-graphql`

## [Setup](https://pothos-graphql.dev/docs/plugins/add-graphql#setup)

```
import AddGraphQLPlugin from '@pothos/plugin-add-graphql';

const builder = new SchemaBuilder({
  plugins: [AddGraphQLPlugin],
});
```

## [Usage](https://pothos-graphql.dev/docs/plugins/add-graphql#usage)

There are 2 ways you can reference existing types.

- Adding types (or a whole external schema) when setting up the builder
- Adding types as Refs using new builder methods

### [Adding types when creating your builder](https://pothos-graphql.dev/docs/plugins/add-graphql#adding-types-when-creating-your-builder)

Adding types to the builder will automatically include the types in your schema when it's built. Types will only be added if no existing type of the same name is added to the builder before building the schema.

Adding types recursively adds any other types that the added type depends in it's fields, interfaces, or union members.

```
import { existingSchema } from './existing-schema-location';

const builder = new SchemaBuilder({
  plugins: [AddGraphQLPlugin],
  add: {
    // You can add individual types
    // This accepts Any GraphQLNamedType (Objects, Interface, Unions, Enums, Scalars, and InputObjects)
    types: [existingSchema.getType('User'), existingSchema.getType('Post')],
    // Or you can add an entire external schema
    schema: existingSchema,
  },
});
```

Adding types by themselves isn't very useful, so you'll probably want to be able to reference them when defining fields in your schema. To do this, you can add them to the builders generic Types.

This currently only works for `Object`, `Interface`, and `Scalar` types. For other types, use the builder methods below to create refs to the added types.

```
import { existingSchema } from './existing-schema-location';

const builder = new SchemaBuilder<{
  Objects: {
    User: UserType;
  };
  Interfaces: {
    ExampleInterface: { id: string };
  };
  Scalars: {
    DateTime: {
      Output: Date;
      Input: Date;
    };
  };
}>({
  plugins: [AddGraphQLPlugin],
  add: {
    types: [
      existingSchema.getType('User'),
      existingSchema.getType('ExampleInterface'),
      existingSchema.getType('DateTime'),
    ],
  },
});

builder.queryFields((t) => ({
  user: t.field({ type: 'User', resolve: () => getUser() }),
  exampleInterface: t.field({ type: 'ExampleInterface', resolve: () => getThings() }),
  now: t.field({ type: 'DateTime', resolve: () => new Date() }),
}));
```

### [Adding types using builder methods](https://pothos-graphql.dev/docs/plugins/add-graphql#adding-types-using-builder-methods)

#### [Objects](https://pothos-graphql.dev/docs/plugins/add-graphql#objects)

```
// Passing in a generic type is recommended to ensure type-safety
const UserRef = builder.addGraphQLObject<UserType>(
  existingSchema.getType('User') as GraphQLObjectType,
  {
    // Optionally you can override the types name
    name: 'AddedUser',
    // You can also pass in any other options you can define for normal object types
    description: 'This type represents Users',
  },
);

const PostRef = builder.addGraphQLObject<{
  id: string;
  title: string;
  content: string;
}>(existingSchema.getType('Post') as GraphQLObjectType, {
  fields: (t) => ({
    // remove existing title field from type
    title: null,
    // add new titleField
    postTitle: t.exposeString('title'),
  }),
});
```

You can then use the returned references when defining fields:

```
builder.queryFields((t) => ({
  posts: t.field({
    type: [PostRef],
    resolve: () => loadPosts(),
  }),
}));
```

### [Interfaces](https://pothos-graphql.dev/docs/plugins/add-graphql#interfaces)

```
const NodeRef = builder.addGraphQLInterface<NodeShape>(
  existingSchema.getType('Node') as GraphQLInterfaceType,
  {
    // interface options
  },
);
```

### [Unions](https://pothos-graphql.dev/docs/plugins/add-graphql#unions)

```
const SearchResult = builder.addGraphQLUnion<User | Post>(
  existingSchema.getType('SearchResult') as GraphQLUnionType,
  {
    // union options
  },
);
```

### [Enums](https://pothos-graphql.dev/docs/plugins/add-graphql#enums)

```
const OrderBy = builder.addGraphQLEnum<'Asc' | 'Desc'>(
  existingSchema.getType('OrderBy') as GraphQLEnumType,
  {
    // enum options
  },
);
```

### [Input objects](https://pothos-graphql.dev/docs/plugins/add-graphql#input-objects)

```
const PostFilter = builder.addGraphQLInput<{ title?: string, tags? string[] }>(
  existingSchema.getType('PostFilter') as GraphQLInputObjectType,
  {
    // input options
  },
);
```

### [Scalars](https://pothos-graphql.dev/docs/plugins/add-graphql#scalars)

This plugin does not add a new method for scalars, because Pothos already has a method for adding existing scalar types.

```
builder.addScalarType('DateTime', existingSchema.getType('DateTime') as GraphQLScalar, {
  // scalar options
});
```

[Plugins List of plugins for Pothos](https://pothos-graphql.dev/docs/plugins)[Complexity plugin Complexity plugin docs for Pothos](https://pothos-graphql.dev/docs/plugins/complexity)

### On this page

[Install](https://pothos-graphql.dev/docs/plugins/add-graphql#install)[Setup](https://pothos-graphql.dev/docs/plugins/add-graphql#setup)[Usage](https://pothos-graphql.dev/docs/plugins/add-graphql#usage)[Adding types when creating your builder](https://pothos-graphql.dev/docs/plugins/add-graphql#adding-types-when-creating-your-builder)[Adding types using builder methods](https://pothos-graphql.dev/docs/plugins/add-graphql#adding-types-using-builder-methods)[Objects](https://pothos-graphql.dev/docs/plugins/add-graphql#objects)[Interfaces](https://pothos-graphql.dev/docs/plugins/add-graphql#interfaces)[Unions](https://pothos-graphql.dev/docs/plugins/add-graphql#unions)[Enums](https://pothos-graphql.dev/docs/plugins/add-graphql#enums)[Input objects](https://pothos-graphql.dev/docs/plugins/add-graphql#input-objects)[Scalars](https://pothos-graphql.dev/docs/plugins/add-graphql#scalars)

---

## URL: https://pothos-graphql.dev/docs/plugins/add-graphql#adding-types-when-creating-your-builder

Title: Add GraphQL plugin

URL Source: https://pothos-graphql.dev/docs/plugins/add-graphql

Markdown Content:
Add GraphQL plugin

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 1: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Add GraphQL plugin](https://pothos-graphql.dev/docs/plugins/add-graphql)[Complexity plugin](https://pothos-graphql.dev/docs/plugins/complexity)[Dataloader plugin](https://pothos-graphql.dev/docs/plugins/dataloader)[Directive plugin](https://pothos-graphql.dev/docs/plugins/directives)[Drizzle plugin](https://pothos-graphql.dev/docs/plugins/drizzle)[Errors plugin](https://pothos-graphql.dev/docs/plugins/errors)[Federation plugin](https://pothos-graphql.dev/docs/plugins/federation)[Mocks plugin](https://pothos-graphql.dev/docs/plugins/mocks)[Relay plugin](https://pothos-graphql.dev/docs/plugins/relay)[Auth plugin](https://pothos-graphql.dev/docs/plugins/scope-auth)[Simple objects plugin](https://pothos-graphql.dev/docs/plugins/simple-objects)[Smart subscriptions plugin](https://pothos-graphql.dev/docs/plugins/smart-subscriptions)[SubGraph plugin](https://pothos-graphql.dev/docs/plugins/sub-graph)[Tracing plugin](https://pothos-graphql.dev/docs/plugins/tracing)[With-Input plugin](https://pothos-graphql.dev/docs/plugins/with-input)[Zod Validation plugin](https://pothos-graphql.dev/docs/plugins/zod)

[Prisma](https://pothos-graphql.dev/docs/plugins/prisma)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

Add GraphQL plugin Install

[Plugins](https://pothos-graphql.dev/docs/plugins)

# Add GraphQL plugin

This plugin makes it easy to integrate GraphQL types from existing schemas into your Pothos API

It can be used for incremental migrations from nexus, graphql-tools, or any other JS/TS executable schema.

## [Install](https://pothos-graphql.dev/docs/plugins/add-graphql#install)

npm pnpm yarn bun

`npm install --save @pothos/plugin-add-graphql`

## [Setup](https://pothos-graphql.dev/docs/plugins/add-graphql#setup)

```
import AddGraphQLPlugin from '@pothos/plugin-add-graphql';

const builder = new SchemaBuilder({
  plugins: [AddGraphQLPlugin],
});
```

## [Usage](https://pothos-graphql.dev/docs/plugins/add-graphql#usage)

There are 2 ways you can reference existing types.

- Adding types (or a whole external schema) when setting up the builder
- Adding types as Refs using new builder methods

### [Adding types when creating your builder](https://pothos-graphql.dev/docs/plugins/add-graphql#adding-types-when-creating-your-builder)

Adding types to the builder will automatically include the types in your schema when it's built. Types will only be added if no existing type of the same name is added to the builder before building the schema.

Adding types recursively adds any other types that the added type depends in it's fields, interfaces, or union members.

```
import { existingSchema } from './existing-schema-location';

const builder = new SchemaBuilder({
  plugins: [AddGraphQLPlugin],
  add: {
    // You can add individual types
    // This accepts Any GraphQLNamedType (Objects, Interface, Unions, Enums, Scalars, and InputObjects)
    types: [existingSchema.getType('User'), existingSchema.getType('Post')],
    // Or you can add an entire external schema
    schema: existingSchema,
  },
});
```

Adding types by themselves isn't very useful, so you'll probably want to be able to reference them when defining fields in your schema. To do this, you can add them to the builders generic Types.

This currently only works for `Object`, `Interface`, and `Scalar` types. For other types, use the builder methods below to create refs to the added types.

```
import { existingSchema } from './existing-schema-location';

const builder = new SchemaBuilder<{
  Objects: {
    User: UserType;
  };
  Interfaces: {
    ExampleInterface: { id: string };
  };
  Scalars: {
    DateTime: {
      Output: Date;
      Input: Date;
    };
  };
}>({
  plugins: [AddGraphQLPlugin],
  add: {
    types: [
      existingSchema.getType('User'),
      existingSchema.getType('ExampleInterface'),
      existingSchema.getType('DateTime'),
    ],
  },
});

builder.queryFields((t) => ({
  user: t.field({ type: 'User', resolve: () => getUser() }),
  exampleInterface: t.field({ type: 'ExampleInterface', resolve: () => getThings() }),
  now: t.field({ type: 'DateTime', resolve: () => new Date() }),
}));
```

### [Adding types using builder methods](https://pothos-graphql.dev/docs/plugins/add-graphql#adding-types-using-builder-methods)

#### [Objects](https://pothos-graphql.dev/docs/plugins/add-graphql#objects)

```
// Passing in a generic type is recommended to ensure type-safety
const UserRef = builder.addGraphQLObject<UserType>(
  existingSchema.getType('User') as GraphQLObjectType,
  {
    // Optionally you can override the types name
    name: 'AddedUser',
    // You can also pass in any other options you can define for normal object types
    description: 'This type represents Users',
  },
);

const PostRef = builder.addGraphQLObject<{
  id: string;
  title: string;
  content: string;
}>(existingSchema.getType('Post') as GraphQLObjectType, {
  fields: (t) => ({
    // remove existing title field from type
    title: null,
    // add new titleField
    postTitle: t.exposeString('title'),
  }),
});
```

You can then use the returned references when defining fields:

```
builder.queryFields((t) => ({
  posts: t.field({
    type: [PostRef],
    resolve: () => loadPosts(),
  }),
}));
```

### [Interfaces](https://pothos-graphql.dev/docs/plugins/add-graphql#interfaces)

```
const NodeRef = builder.addGraphQLInterface<NodeShape>(
  existingSchema.getType('Node') as GraphQLInterfaceType,
  {
    // interface options
  },
);
```

### [Unions](https://pothos-graphql.dev/docs/plugins/add-graphql#unions)

```
const SearchResult = builder.addGraphQLUnion<User | Post>(
  existingSchema.getType('SearchResult') as GraphQLUnionType,
  {
    // union options
  },
);
```

### [Enums](https://pothos-graphql.dev/docs/plugins/add-graphql#enums)

```
const OrderBy = builder.addGraphQLEnum<'Asc' | 'Desc'>(
  existingSchema.getType('OrderBy') as GraphQLEnumType,
  {
    // enum options
  },
);
```

### [Input objects](https://pothos-graphql.dev/docs/plugins/add-graphql#input-objects)

```
const PostFilter = builder.addGraphQLInput<{ title?: string, tags? string[] }>(
  existingSchema.getType('PostFilter') as GraphQLInputObjectType,
  {
    // input options
  },
);
```

### [Scalars](https://pothos-graphql.dev/docs/plugins/add-graphql#scalars)

This plugin does not add a new method for scalars, because Pothos already has a method for adding existing scalar types.

```
builder.addScalarType('DateTime', existingSchema.getType('DateTime') as GraphQLScalar, {
  // scalar options
});
```

[Plugins List of plugins for Pothos](https://pothos-graphql.dev/docs/plugins)[Complexity plugin Complexity plugin docs for Pothos](https://pothos-graphql.dev/docs/plugins/complexity)

### On this page

[Install](https://pothos-graphql.dev/docs/plugins/add-graphql#install)[Setup](https://pothos-graphql.dev/docs/plugins/add-graphql#setup)[Usage](https://pothos-graphql.dev/docs/plugins/add-graphql#usage)[Adding types when creating your builder](https://pothos-graphql.dev/docs/plugins/add-graphql#adding-types-when-creating-your-builder)[Adding types using builder methods](https://pothos-graphql.dev/docs/plugins/add-graphql#adding-types-using-builder-methods)[Objects](https://pothos-graphql.dev/docs/plugins/add-graphql#objects)[Interfaces](https://pothos-graphql.dev/docs/plugins/add-graphql#interfaces)[Unions](https://pothos-graphql.dev/docs/plugins/add-graphql#unions)[Enums](https://pothos-graphql.dev/docs/plugins/add-graphql#enums)[Input objects](https://pothos-graphql.dev/docs/plugins/add-graphql#input-objects)[Scalars](https://pothos-graphql.dev/docs/plugins/add-graphql#scalars)

---

## URL: https://pothos-graphql.dev/docs/plugins/add-graphql#scalars

Title: Add GraphQL plugin

URL Source: https://pothos-graphql.dev/docs/plugins/add-graphql

Markdown Content:
Add GraphQL plugin

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 1: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Add GraphQL plugin](https://pothos-graphql.dev/docs/plugins/add-graphql)[Complexity plugin](https://pothos-graphql.dev/docs/plugins/complexity)[Dataloader plugin](https://pothos-graphql.dev/docs/plugins/dataloader)[Directive plugin](https://pothos-graphql.dev/docs/plugins/directives)[Drizzle plugin](https://pothos-graphql.dev/docs/plugins/drizzle)[Errors plugin](https://pothos-graphql.dev/docs/plugins/errors)[Federation plugin](https://pothos-graphql.dev/docs/plugins/federation)[Mocks plugin](https://pothos-graphql.dev/docs/plugins/mocks)[Relay plugin](https://pothos-graphql.dev/docs/plugins/relay)[Auth plugin](https://pothos-graphql.dev/docs/plugins/scope-auth)[Simple objects plugin](https://pothos-graphql.dev/docs/plugins/simple-objects)[Smart subscriptions plugin](https://pothos-graphql.dev/docs/plugins/smart-subscriptions)[SubGraph plugin](https://pothos-graphql.dev/docs/plugins/sub-graph)[Tracing plugin](https://pothos-graphql.dev/docs/plugins/tracing)[With-Input plugin](https://pothos-graphql.dev/docs/plugins/with-input)[Zod Validation plugin](https://pothos-graphql.dev/docs/plugins/zod)

[Prisma](https://pothos-graphql.dev/docs/plugins/prisma)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

Add GraphQL plugin Install

[Plugins](https://pothos-graphql.dev/docs/plugins)

# Add GraphQL plugin

This plugin makes it easy to integrate GraphQL types from existing schemas into your Pothos API

It can be used for incremental migrations from nexus, graphql-tools, or any other JS/TS executable schema.

## [Install](https://pothos-graphql.dev/docs/plugins/add-graphql#install)

npm pnpm yarn bun

`npm install --save @pothos/plugin-add-graphql`

## [Setup](https://pothos-graphql.dev/docs/plugins/add-graphql#setup)

```
import AddGraphQLPlugin from '@pothos/plugin-add-graphql';

const builder = new SchemaBuilder({
  plugins: [AddGraphQLPlugin],
});
```

## [Usage](https://pothos-graphql.dev/docs/plugins/add-graphql#usage)

There are 2 ways you can reference existing types.

- Adding types (or a whole external schema) when setting up the builder
- Adding types as Refs using new builder methods

### [Adding types when creating your builder](https://pothos-graphql.dev/docs/plugins/add-graphql#adding-types-when-creating-your-builder)

Adding types to the builder will automatically include the types in your schema when it's built. Types will only be added if no existing type of the same name is added to the builder before building the schema.

Adding types recursively adds any other types that the added type depends in it's fields, interfaces, or union members.

```
import { existingSchema } from './existing-schema-location';

const builder = new SchemaBuilder({
  plugins: [AddGraphQLPlugin],
  add: {
    // You can add individual types
    // This accepts Any GraphQLNamedType (Objects, Interface, Unions, Enums, Scalars, and InputObjects)
    types: [existingSchema.getType('User'), existingSchema.getType('Post')],
    // Or you can add an entire external schema
    schema: existingSchema,
  },
});
```

Adding types by themselves isn't very useful, so you'll probably want to be able to reference them when defining fields in your schema. To do this, you can add them to the builders generic Types.

This currently only works for `Object`, `Interface`, and `Scalar` types. For other types, use the builder methods below to create refs to the added types.

```
import { existingSchema } from './existing-schema-location';

const builder = new SchemaBuilder<{
  Objects: {
    User: UserType;
  };
  Interfaces: {
    ExampleInterface: { id: string };
  };
  Scalars: {
    DateTime: {
      Output: Date;
      Input: Date;
    };
  };
}>({
  plugins: [AddGraphQLPlugin],
  add: {
    types: [
      existingSchema.getType('User'),
      existingSchema.getType('ExampleInterface'),
      existingSchema.getType('DateTime'),
    ],
  },
});

builder.queryFields((t) => ({
  user: t.field({ type: 'User', resolve: () => getUser() }),
  exampleInterface: t.field({ type: 'ExampleInterface', resolve: () => getThings() }),
  now: t.field({ type: 'DateTime', resolve: () => new Date() }),
}));
```

### [Adding types using builder methods](https://pothos-graphql.dev/docs/plugins/add-graphql#adding-types-using-builder-methods)

#### [Objects](https://pothos-graphql.dev/docs/plugins/add-graphql#objects)

```
// Passing in a generic type is recommended to ensure type-safety
const UserRef = builder.addGraphQLObject<UserType>(
  existingSchema.getType('User') as GraphQLObjectType,
  {
    // Optionally you can override the types name
    name: 'AddedUser',
    // You can also pass in any other options you can define for normal object types
    description: 'This type represents Users',
  },
);

const PostRef = builder.addGraphQLObject<{
  id: string;
  title: string;
  content: string;
}>(existingSchema.getType('Post') as GraphQLObjectType, {
  fields: (t) => ({
    // remove existing title field from type
    title: null,
    // add new titleField
    postTitle: t.exposeString('title'),
  }),
});
```

You can then use the returned references when defining fields:

```
builder.queryFields((t) => ({
  posts: t.field({
    type: [PostRef],
    resolve: () => loadPosts(),
  }),
}));
```

### [Interfaces](https://pothos-graphql.dev/docs/plugins/add-graphql#interfaces)

```
const NodeRef = builder.addGraphQLInterface<NodeShape>(
  existingSchema.getType('Node') as GraphQLInterfaceType,
  {
    // interface options
  },
);
```

### [Unions](https://pothos-graphql.dev/docs/plugins/add-graphql#unions)

```
const SearchResult = builder.addGraphQLUnion<User | Post>(
  existingSchema.getType('SearchResult') as GraphQLUnionType,
  {
    // union options
  },
);
```

### [Enums](https://pothos-graphql.dev/docs/plugins/add-graphql#enums)

```
const OrderBy = builder.addGraphQLEnum<'Asc' | 'Desc'>(
  existingSchema.getType('OrderBy') as GraphQLEnumType,
  {
    // enum options
  },
);
```

### [Input objects](https://pothos-graphql.dev/docs/plugins/add-graphql#input-objects)

```
const PostFilter = builder.addGraphQLInput<{ title?: string, tags? string[] }>(
  existingSchema.getType('PostFilter') as GraphQLInputObjectType,
  {
    // input options
  },
);
```

### [Scalars](https://pothos-graphql.dev/docs/plugins/add-graphql#scalars)

This plugin does not add a new method for scalars, because Pothos already has a method for adding existing scalar types.

```
builder.addScalarType('DateTime', existingSchema.getType('DateTime') as GraphQLScalar, {
  // scalar options
});
```

[Plugins List of plugins for Pothos](https://pothos-graphql.dev/docs/plugins)[Complexity plugin Complexity plugin docs for Pothos](https://pothos-graphql.dev/docs/plugins/complexity)

### On this page

[Install](https://pothos-graphql.dev/docs/plugins/add-graphql#install)[Setup](https://pothos-graphql.dev/docs/plugins/add-graphql#setup)[Usage](https://pothos-graphql.dev/docs/plugins/add-graphql#usage)[Adding types when creating your builder](https://pothos-graphql.dev/docs/plugins/add-graphql#adding-types-when-creating-your-builder)[Adding types using builder methods](https://pothos-graphql.dev/docs/plugins/add-graphql#adding-types-using-builder-methods)[Objects](https://pothos-graphql.dev/docs/plugins/add-graphql#objects)[Interfaces](https://pothos-graphql.dev/docs/plugins/add-graphql#interfaces)[Unions](https://pothos-graphql.dev/docs/plugins/add-graphql#unions)[Enums](https://pothos-graphql.dev/docs/plugins/add-graphql#enums)[Input objects](https://pothos-graphql.dev/docs/plugins/add-graphql#input-objects)[Scalars](https://pothos-graphql.dev/docs/plugins/add-graphql#scalars)

---

## URL: https://pothos-graphql.dev/docs/plugins/scope-auth#using-a-scope-on-a-field

Title: Auth plugin

URL Source: https://pothos-graphql.dev/docs/plugins/scope-auth

Markdown Content:
The scope auth plugin aims to be a general purpose authorization plugin that can handle a wide variety of authorization use cases, while incurring a minimal performance overhead.

### [Install](https://pothos-graphql.dev/docs/plugins/scope-auth#install)

#### [IMPORTANT](https://pothos-graphql.dev/docs/plugins/scope-auth#important)

When using `scope-auth` with other plugins, the `scope-auth` plugin should generally be listed first to ensure that other plugins that wrap resolvers do not execute before the `scope-auth` logic. However, exceptions do exist where it is desirable for a plugin to run before `scope-auth`. For instance, putting the [relay plugin](https://pothos-graphql.dev/docs/plugins/relay) before the `scope-auth` plugin results in the `authScopes` function correctly receiving parsed `globalID`s.

### [Setup](https://pothos-graphql.dev/docs/plugins/scope-auth#setup)

In the above setup, We import the `scope-auth` plugin, and include it in the builders plugin list. We also define 2 important things:

1.  The `AuthScopes` type in the builder `SchemaTypes`. This is a map of types that defines the types used by each of your scopes. We'll see how this is used in more detail below.

2.  The `scope initializer` function, which is the implementation of each of the scopes defined in the type above. This function returns a map of either booleans (indicating if the request has the scope) or functions that load the scope (with an optional parameter).

The names of the scopes (`public`, `employee`, `deferredScope`, and `customPerm`) are all arbitrary, and are not part of the plugin. You can use whatever scope names you prefer, and can add as many you need.

### [Using a scope on a field](https://pothos-graphql.dev/docs/plugins/scope-auth#using-a-scope-on-a-field)

A lot of terms around authorization are overloaded, and can mean different things to different people. Here is a short list of a few terms used in this document, and how they should be interpreted:

- `scope`: A scope is the unit of authorization that can be used to authorize a request to resolve a field.

- `scope map`: A map of scope names and scope parameters. This defines the set of scopes that will be checked for a field or type to authorize the request the resolve a resource.

- `scope loader`: A function for dynamically loading scope given a scope parameter. Scope loaders are ideal for integrating with a permission service, or creating scopes that can be customized based on the field or values that they are authorizing.

- `scope parameter`: A parameter that will be passed to a scope loader. These are the values in the authScopes objects.

- `scope initializer`: The function that creates the scopes or scope loaders for the current request.

While this plugin uses `scopes` as the term for its authorization mechanism, this plugin can easily be used for role or permission based schemes, and is not intended to dictate a specific philosophy around how to authorize requests/access to resources.

Examples below assume the following builder setup:

### [Top level auth on queries and mutations](https://pothos-graphql.dev/docs/plugins/scope-auth#top-level-auth-on-queries-and-mutations)

To add an auth check to root level queries or mutations, add authScopes to the field options:

This will require the requests to have the `employee` scope. Adding multiple scopes to the `authScopes` object will check all the scopes, and if the user has any of the scopes, the request will be considered authorized for the current field. Subscription and Mutation root fields work the same way.

### [Auth on nested fields](https://pothos-graphql.dev/docs/plugins/scope-auth#auth-on-nested-fields)

Fields on nested objects can be authorized the same way scopes are authorized on the root types.

### [Default auth for all fields on types](https://pothos-graphql.dev/docs/plugins/scope-auth#default-auth-for-all-fields-on-types)

To apply the same scope requirements to all fields on a type, you can define an `authScope` map in the type options rather than on the individual fields.

### [Overwriting default auth on field](https://pothos-graphql.dev/docs/plugins/scope-auth#overwriting-default-auth-on-field)

In some cases you may want to use default auth scopes for a type, but need to change the behavior for one specific field.

To add additional requirements for a specific field you can simply add additional scopes on the field itself.

To remove the type level scopes for a field, you can use the `skipTypeScopes` option:

This will allow non-logged in users to resolve the title, but not the content of an Article. `skipTypeScopes` can be used in conjunction with `authScopes` on a field to completely overwrite the default scopes.

### [Running scopes on types rather than fields](https://pothos-graphql.dev/docs/plugins/scope-auth#running-scopes-on-types-rather-than-fields)

By default, all auth scopes are tested before a field resolves. This includes both scopes defined on a type and scopes defined on a field. When scopes for a `type` fail, you will end up with an error for each field of that type. Type level scopes are only executed once, but the errors are emitted for each affected field.

The behavior may not be desirable for all users. You can set `runScopesOnType` to true, either on object types, or in the `scopeAuth` options of the builder

Enabling this has a couple of limitations:

1.  THIS DOES NOT CURRENTLY WORK WITH `graphql-jit`. This option uses the `isTypeOf` function, but `graphql-jit` does not support async `isTypeOf`, and also does not correctly pass the context object to the isTypeOf checks. Until this is resolved, this option will not work with `graphql-jit`.

2.  Fields of types that set `runScopesOnType` to true will not be able to use `skipTypeScopes` or `skipInterfaceScopes`.

### [Generalized auth functions with field specific arguments](https://pothos-graphql.dev/docs/plugins/scope-auth#generalized-auth-functions-with-field-specific-arguments)

The scopes we have covered so far have all been related to information that applies to a full request. In more complex applications you may not make sense to enumerate all the scopes a request is authorized for ahead of time. To handle these cases you can define a scope loader which takes a parameter and dynamically determines if a request is authorized for a scope using that parameter.

One common example of this would be a permission service that can check if a user or request has a certain permission, and you want to specify the specific permission each field requires.

In the example above, the authScope map uses the customPerm scope loader with a parameter of `readArticle`. The first time a field requests this scope, the customPerm loader will be called with `readArticle` as its argument. This scope will be cached, so that if multiple fields request the same scope, the scope loader will still only be called once.

The types for the parameters you provide for each scope are based on the types provided to the builder in the `AuthScopes` type.

### [Customizing error messages](https://pothos-graphql.dev/docs/plugins/scope-auth#customizing-error-messages)

Error messages (and error instances) can be customized either globally or on specific fields.

#### [Globally](https://pothos-graphql.dev/docs/plugins/scope-auth#globally)

The `unauthorizedError` callback will be called with the parent, context, and info object of the unauthorized field. It will also include a 4th argument `result` that has the default message for this type of failure, and a `failure` property with some details about what caused the field to be unauthorized. This callback can either return an `Error` instance (or an instance of a class that extends `Error`), or a `string`. If a string is returned, it will be converted to a `ForbiddenError`.

The `treatErrorsAsUnauthorized` option changes how errors in authorization functions are handled. By default errors are not caught by the plugin, and will act as if thrown directly from the resolver. This means that thrown errors bypass the `unauthorizedError` callback, and will cause requests to fail even when another scope in an `$any` passes.

Setting `treatErrorsAsUnauthorized` will cause errors to be caught and treated as if the scope was not authorized.

When `treatErrorsAsUnauthorized` is set to true, errors are caught and attached to the `result` object in the `unauthorizedError` callback. This allows you to surface the error to the client.

For example, if you want to re-throw errors thrown by authorization functions you could do this by writing a custom `unauthorizedError` callback like this:

#### [On individual fields](https://pothos-graphql.dev/docs/plugins/scope-auth#on-individual-fields)

### [Returning a custom value when unauthorized](https://pothos-graphql.dev/docs/plugins/scope-auth#returning-a-custom-value-when-unauthorized)

In some cases you may want to return null, and empty array, throw a custom error, or return a custom result when a user is not authorized. To do this you can add a `unauthorizedResolver` option to your field.

In the example above, if a user is not authorized they will simply receive an empty array in the response. The `unauthorizedResolver` option takes the same arguments as a resolver, but also receives a 5th argument that is an instance of `ForbiddenError`.

### [Setting scopes that apply for a full request](https://pothos-graphql.dev/docs/plugins/scope-auth#setting-scopes-that-apply-for-a-full-request)

We have already seen several examples of this. For scopes that apply to a full request like `public` or `employee`, rather than using a scope loader, the scope initializer can simply use a boolean to indicate if the request has the given scope. If you know ahead of time that a scope loader will always return false for a specific request, you can do something like the following to avoid the additional overhead of running the loader:

This will ensure that if a request accesses a field that requests a `humanPermission` scope, and the request is made by another service or bot, we don't have to run the `hasPermission` check at all for those requests, since we know it would return false anyways.

### [Change context types based on scopes](https://pothos-graphql.dev/docs/plugins/scope-auth#change-context-types-based-on-scopes)

Sometimes you need to change your context typings depending on the applied scopes. You can provide custom context for your defined scopes and use the `authField` method to access the custom context:

Some plugins contribute field builder methods with additional functionality that may not work with `t.authField`. In order to work with those methods, there is also a `t.withAuth` method that can be used to return a field builder with authScopes predefined.

### [Logical operations on auth scopes (any/all)](https://pothos-graphql.dev/docs/plugins/scope-auth#logical-operations-on-auth-scopes-anyall)

By default the scopes in a scope map are evaluated in parallel, and if the request has any of the requested scopes, the field will be resolved. In some cases, you may want to require multiple scopes:

You can use the built in `$any` and `$all` scope loaders to combine requirements for scopes. The above example requires a request to have either the `employee` or `deferredScope` scopes, and the `public` scope. `$any` and `$all` each take a scope map as their parameters, and can be nested inside each other.

You can change the default strategy used for top level auth scopes by setting the `defaultStrategy` option in the builder (defaults to `any`):

### [Auth that depends on parent value](https://pothos-graphql.dev/docs/plugins/scope-auth#auth-that-depends-on-parent-value)

For cases where the required scopes depend on the value of the requested resource you can use a function in the `authScopes` option that returns the scope map for the field.

authScope functions on fields will receive the same arguments as the field resolver, and will be called each time the resolve for the field would be called. This means the same authScope function could be called multiple time for the same resource if the field is requested multiple times using an alias.

Returning a boolean from an auth scope function is an easy way to allow or disallow a request from resolving a field without needing to evaluate additional scopes.

### [Setting type level scopes based on the parent value](https://pothos-graphql.dev/docs/plugins/scope-auth#setting-type-level-scopes-based-on-the-parent-value)

You can also use a function in the authScope option for types. This function will be invoked with the parent and the context as its arguments, and should return a scope map.

The above example uses an authScope function to prevent the fields of an article from being loaded by non employees unless they have been published.

### [Setting scopes based on the return value of a field](https://pothos-graphql.dev/docs/plugins/scope-auth#setting-scopes-based-on-the-return-value-of-a-field)

This is a use that is not currently supported. The current work around is to move those checks down to the returned type. Combining this with `runScopesOnType` should work for most cases.

### [Granting access to a resource based on how it is accessed](https://pothos-graphql.dev/docs/plugins/scope-auth#granting-access-to-a-resource-based-on-how-it-is-accessed)

In some cases, you may want to grant a request scopes to access certain fields on a child type. To do this you can use `$granted` scopes.

In the above example, the fields of the `Article` type normally require the `public` scope granted to logged in users, but can also be accessed with the `$granted` scope `readArticle`. This means that if the field that returned the Article "granted" the scope, the article can be read. The `freeArticle` field on the `Query` type grants this scope, allowing anyone querying that field to access fields of the free article. `$granted` scopes are separate from other scopes, and do not give a request access to normal scopes of the same name. `$granted` scopes are also not inherited by nested children, and would need to be explicitly passed down for each field if you wanted to grant access to nested children.

### [Reusing checks for multiple, but not all fields](https://pothos-graphql.dev/docs/plugins/scope-auth#reusing-checks-for-multiple-but-not-all-fields)

You may have cases where groups of fields on a type are accessible using some shared condition. This is another case where `$granted` scopes can be helpful.

In the above example, `title`, `content`, and `viewCount` each use `$granted` scopes. In this case, rather than scopes being granted by the parent field, they are granted by the Article type itself. This allows the access to each field to change based on some dynamic conditions (if the request is from the author, and if the article is a draft) without having to duplicate that logic in each individual field.

### [Interfaces](https://pothos-graphql.dev/docs/plugins/scope-auth#interfaces)

Interfaces can define auth scopes on their fields the same way objects do. Fields for a type will run checks for each interface it implements separately, meaning that a request would need to satisfy the scope requirements for each interface separately before the field is resolved.

Object types can set `skipInterfaceScopes` to `true` to skip interface checks when resolving fields for that Object type.

### [Cache keys](https://pothos-graphql.dev/docs/plugins/scope-auth#cache-keys)

Auth scopes by default are cached based on the identity of the scope parameter. This works great for statically defined scopes, and scopes that take primitive values as their parameters. If you define auth scopes that take complex objects, and create those objects in a scope function (based on arguments, or parent values) You won't get cache hits on those checks.

To work around this, you can provide a `cacheKey` option to the builder for generating a cache key from your scope checks.

Above we are using `JSON.stringify` to generate a key. This will work for most complex objects, but you may want to consider something like `faster-stable-stringify` that can handle circular references, and swill always produce the same output regardless of the order of properties.

### [Scope Initializer](https://pothos-graphql.dev/docs/plugins/scope-auth#scope-initializer)

The scope initializer would be run once the first time a field protected by auth scopes is resolved, its result will be cached for the current request.

### [authScopes functions on fields](https://pothos-graphql.dev/docs/plugins/scope-auth#authscopes-functions-on-fields)

When using a function for `authScopes` on a field, the function will be run each time the field is resolved, since it has access to all the arguments passed to the resolver

### [authScopes functions on types](https://pothos-graphql.dev/docs/plugins/scope-auth#authscopes-functions-on-types)

When using a function for `authScopes` on a type, the function will be run the once for each instance of that type in the response. It will be run lazily when the first field for that object is resolved, and its result will be cached and reused by all fields for that instance of the type.

### [scope loaders](https://pothos-graphql.dev/docs/plugins/scope-auth#scope-loaders)

Scope loaders will be run run whenever a field requires the corresponding scope with a unique parameter. The scope loader results are cached per request based on a combination of the name of the scope, and its parameter.

### [grantScope on field](https://pothos-graphql.dev/docs/plugins/scope-auth#grantscope-on-field)

`grantScopes` on a field will run after the field is resolved, and is not cached

### [grantScope on type](https://pothos-graphql.dev/docs/plugins/scope-auth#grantscope-on-type)

`grantScopes` on a type (object or interface) will run when the first field on the type is resolved. It's result will be cached and reused for each field of the same instance of the type.

### [Types](https://pothos-graphql.dev/docs/plugins/scope-auth#types)

- `AuthScopes`: `extends {}`. Each property is the name of its scope, each value is the type for the scopes parameter.

- `ScopeLoaderMap`: Object who's keys are scope names (from `AuthScopes`) and whos values are either booleans (indicating whether or not the request has the scope) or function that take a parameter (type from `AuthScope`) and return `MaybePromise<boolean>`

- `ScopeMap`: A map of scope names to parameters. Based on `AuthScopes`, may also contain `$all`, `$any` or `$granted`.

### [Builder](https://pothos-graphql.dev/docs/plugins/scope-auth#builder)

- `authScopes`: (context: Types['Context']) =>`MaybePromise<ScopeLoaderMap<Types>>`

### [Object and Interface options](https://pothos-graphql.dev/docs/plugins/scope-auth#object-and-interface-options)

- `authScopes`: `ScopeMap` or `function`, accepts `parent` and `context` returns `MaybePromise<ScopeMap>`

- `grantScopes`: `function`, accepts `parent` and `context` returns `MaybePromise<string[]>`

### [Field Options](https://pothos-graphql.dev/docs/plugins/scope-auth#field-options)

- `authScopes`: `ScopeMap` or `function`, accepts same arguments as resolver, returns `MaybePromise<ScopeMap>`

- `grantScopes`: `string[]` or `function`, accepts same arguments as resolver, returns `MaybePromise<string[]>`

- `skipTypeScopes`: `boolean`

- `skipInterfaceScopes`: `boolean`

### [toSchema options](https://pothos-graphql.dev/docs/plugins/scope-auth#toschema-options)

- `disableScopeAuth`: disable the scope auth plugin. Useful for testing.

---

## URL: https://pothos-graphql.dev/docs/plugins/scope-auth#cache-keys

Title: Auth plugin

URL Source: https://pothos-graphql.dev/docs/plugins/scope-auth

Markdown Content:
The scope auth plugin aims to be a general purpose authorization plugin that can handle a wide variety of authorization use cases, while incurring a minimal performance overhead.

### [Install](https://pothos-graphql.dev/docs/plugins/scope-auth#install)

#### [IMPORTANT](https://pothos-graphql.dev/docs/plugins/scope-auth#important)

When using `scope-auth` with other plugins, the `scope-auth` plugin should generally be listed first to ensure that other plugins that wrap resolvers do not execute before the `scope-auth` logic. However, exceptions do exist where it is desirable for a plugin to run before `scope-auth`. For instance, putting the [relay plugin](https://pothos-graphql.dev/docs/plugins/relay) before the `scope-auth` plugin results in the `authScopes` function correctly receiving parsed `globalID`s.

### [Setup](https://pothos-graphql.dev/docs/plugins/scope-auth#setup)

In the above setup, We import the `scope-auth` plugin, and include it in the builders plugin list. We also define 2 important things:

1.  The `AuthScopes` type in the builder `SchemaTypes`. This is a map of types that defines the types used by each of your scopes. We'll see how this is used in more detail below.

2.  The `scope initializer` function, which is the implementation of each of the scopes defined in the type above. This function returns a map of either booleans (indicating if the request has the scope) or functions that load the scope (with an optional parameter).

The names of the scopes (`public`, `employee`, `deferredScope`, and `customPerm`) are all arbitrary, and are not part of the plugin. You can use whatever scope names you prefer, and can add as many you need.

### [Using a scope on a field](https://pothos-graphql.dev/docs/plugins/scope-auth#using-a-scope-on-a-field)

A lot of terms around authorization are overloaded, and can mean different things to different people. Here is a short list of a few terms used in this document, and how they should be interpreted:

- `scope`: A scope is the unit of authorization that can be used to authorize a request to resolve a field.

- `scope map`: A map of scope names and scope parameters. This defines the set of scopes that will be checked for a field or type to authorize the request the resolve a resource.

- `scope loader`: A function for dynamically loading scope given a scope parameter. Scope loaders are ideal for integrating with a permission service, or creating scopes that can be customized based on the field or values that they are authorizing.

- `scope parameter`: A parameter that will be passed to a scope loader. These are the values in the authScopes objects.

- `scope initializer`: The function that creates the scopes or scope loaders for the current request.

While this plugin uses `scopes` as the term for its authorization mechanism, this plugin can easily be used for role or permission based schemes, and is not intended to dictate a specific philosophy around how to authorize requests/access to resources.

Examples below assume the following builder setup:

### [Top level auth on queries and mutations](https://pothos-graphql.dev/docs/plugins/scope-auth#top-level-auth-on-queries-and-mutations)

To add an auth check to root level queries or mutations, add authScopes to the field options:

This will require the requests to have the `employee` scope. Adding multiple scopes to the `authScopes` object will check all the scopes, and if the user has any of the scopes, the request will be considered authorized for the current field. Subscription and Mutation root fields work the same way.

### [Auth on nested fields](https://pothos-graphql.dev/docs/plugins/scope-auth#auth-on-nested-fields)

Fields on nested objects can be authorized the same way scopes are authorized on the root types.

### [Default auth for all fields on types](https://pothos-graphql.dev/docs/plugins/scope-auth#default-auth-for-all-fields-on-types)

To apply the same scope requirements to all fields on a type, you can define an `authScope` map in the type options rather than on the individual fields.

### [Overwriting default auth on field](https://pothos-graphql.dev/docs/plugins/scope-auth#overwriting-default-auth-on-field)

In some cases you may want to use default auth scopes for a type, but need to change the behavior for one specific field.

To add additional requirements for a specific field you can simply add additional scopes on the field itself.

To remove the type level scopes for a field, you can use the `skipTypeScopes` option:

This will allow non-logged in users to resolve the title, but not the content of an Article. `skipTypeScopes` can be used in conjunction with `authScopes` on a field to completely overwrite the default scopes.

### [Running scopes on types rather than fields](https://pothos-graphql.dev/docs/plugins/scope-auth#running-scopes-on-types-rather-than-fields)

By default, all auth scopes are tested before a field resolves. This includes both scopes defined on a type and scopes defined on a field. When scopes for a `type` fail, you will end up with an error for each field of that type. Type level scopes are only executed once, but the errors are emitted for each affected field.

The behavior may not be desirable for all users. You can set `runScopesOnType` to true, either on object types, or in the `scopeAuth` options of the builder

Enabling this has a couple of limitations:

1.  THIS DOES NOT CURRENTLY WORK WITH `graphql-jit`. This option uses the `isTypeOf` function, but `graphql-jit` does not support async `isTypeOf`, and also does not correctly pass the context object to the isTypeOf checks. Until this is resolved, this option will not work with `graphql-jit`.

2.  Fields of types that set `runScopesOnType` to true will not be able to use `skipTypeScopes` or `skipInterfaceScopes`.

### [Generalized auth functions with field specific arguments](https://pothos-graphql.dev/docs/plugins/scope-auth#generalized-auth-functions-with-field-specific-arguments)

The scopes we have covered so far have all been related to information that applies to a full request. In more complex applications you may not make sense to enumerate all the scopes a request is authorized for ahead of time. To handle these cases you can define a scope loader which takes a parameter and dynamically determines if a request is authorized for a scope using that parameter.

One common example of this would be a permission service that can check if a user or request has a certain permission, and you want to specify the specific permission each field requires.

In the example above, the authScope map uses the customPerm scope loader with a parameter of `readArticle`. The first time a field requests this scope, the customPerm loader will be called with `readArticle` as its argument. This scope will be cached, so that if multiple fields request the same scope, the scope loader will still only be called once.

The types for the parameters you provide for each scope are based on the types provided to the builder in the `AuthScopes` type.

### [Customizing error messages](https://pothos-graphql.dev/docs/plugins/scope-auth#customizing-error-messages)

Error messages (and error instances) can be customized either globally or on specific fields.

#### [Globally](https://pothos-graphql.dev/docs/plugins/scope-auth#globally)

The `unauthorizedError` callback will be called with the parent, context, and info object of the unauthorized field. It will also include a 4th argument `result` that has the default message for this type of failure, and a `failure` property with some details about what caused the field to be unauthorized. This callback can either return an `Error` instance (or an instance of a class that extends `Error`), or a `string`. If a string is returned, it will be converted to a `ForbiddenError`.

The `treatErrorsAsUnauthorized` option changes how errors in authorization functions are handled. By default errors are not caught by the plugin, and will act as if thrown directly from the resolver. This means that thrown errors bypass the `unauthorizedError` callback, and will cause requests to fail even when another scope in an `$any` passes.

Setting `treatErrorsAsUnauthorized` will cause errors to be caught and treated as if the scope was not authorized.

When `treatErrorsAsUnauthorized` is set to true, errors are caught and attached to the `result` object in the `unauthorizedError` callback. This allows you to surface the error to the client.

For example, if you want to re-throw errors thrown by authorization functions you could do this by writing a custom `unauthorizedError` callback like this:

#### [On individual fields](https://pothos-graphql.dev/docs/plugins/scope-auth#on-individual-fields)

### [Returning a custom value when unauthorized](https://pothos-graphql.dev/docs/plugins/scope-auth#returning-a-custom-value-when-unauthorized)

In some cases you may want to return null, and empty array, throw a custom error, or return a custom result when a user is not authorized. To do this you can add a `unauthorizedResolver` option to your field.

In the example above, if a user is not authorized they will simply receive an empty array in the response. The `unauthorizedResolver` option takes the same arguments as a resolver, but also receives a 5th argument that is an instance of `ForbiddenError`.

### [Setting scopes that apply for a full request](https://pothos-graphql.dev/docs/plugins/scope-auth#setting-scopes-that-apply-for-a-full-request)

We have already seen several examples of this. For scopes that apply to a full request like `public` or `employee`, rather than using a scope loader, the scope initializer can simply use a boolean to indicate if the request has the given scope. If you know ahead of time that a scope loader will always return false for a specific request, you can do something like the following to avoid the additional overhead of running the loader:

This will ensure that if a request accesses a field that requests a `humanPermission` scope, and the request is made by another service or bot, we don't have to run the `hasPermission` check at all for those requests, since we know it would return false anyways.

### [Change context types based on scopes](https://pothos-graphql.dev/docs/plugins/scope-auth#change-context-types-based-on-scopes)

Sometimes you need to change your context typings depending on the applied scopes. You can provide custom context for your defined scopes and use the `authField` method to access the custom context:

Some plugins contribute field builder methods with additional functionality that may not work with `t.authField`. In order to work with those methods, there is also a `t.withAuth` method that can be used to return a field builder with authScopes predefined.

### [Logical operations on auth scopes (any/all)](https://pothos-graphql.dev/docs/plugins/scope-auth#logical-operations-on-auth-scopes-anyall)

By default the scopes in a scope map are evaluated in parallel, and if the request has any of the requested scopes, the field will be resolved. In some cases, you may want to require multiple scopes:

You can use the built in `$any` and `$all` scope loaders to combine requirements for scopes. The above example requires a request to have either the `employee` or `deferredScope` scopes, and the `public` scope. `$any` and `$all` each take a scope map as their parameters, and can be nested inside each other.

You can change the default strategy used for top level auth scopes by setting the `defaultStrategy` option in the builder (defaults to `any`):

### [Auth that depends on parent value](https://pothos-graphql.dev/docs/plugins/scope-auth#auth-that-depends-on-parent-value)

For cases where the required scopes depend on the value of the requested resource you can use a function in the `authScopes` option that returns the scope map for the field.

authScope functions on fields will receive the same arguments as the field resolver, and will be called each time the resolve for the field would be called. This means the same authScope function could be called multiple time for the same resource if the field is requested multiple times using an alias.

Returning a boolean from an auth scope function is an easy way to allow or disallow a request from resolving a field without needing to evaluate additional scopes.

### [Setting type level scopes based on the parent value](https://pothos-graphql.dev/docs/plugins/scope-auth#setting-type-level-scopes-based-on-the-parent-value)

You can also use a function in the authScope option for types. This function will be invoked with the parent and the context as its arguments, and should return a scope map.

The above example uses an authScope function to prevent the fields of an article from being loaded by non employees unless they have been published.

### [Setting scopes based on the return value of a field](https://pothos-graphql.dev/docs/plugins/scope-auth#setting-scopes-based-on-the-return-value-of-a-field)

This is a use that is not currently supported. The current work around is to move those checks down to the returned type. Combining this with `runScopesOnType` should work for most cases.

### [Granting access to a resource based on how it is accessed](https://pothos-graphql.dev/docs/plugins/scope-auth#granting-access-to-a-resource-based-on-how-it-is-accessed)

In some cases, you may want to grant a request scopes to access certain fields on a child type. To do this you can use `$granted` scopes.

In the above example, the fields of the `Article` type normally require the `public` scope granted to logged in users, but can also be accessed with the `$granted` scope `readArticle`. This means that if the field that returned the Article "granted" the scope, the article can be read. The `freeArticle` field on the `Query` type grants this scope, allowing anyone querying that field to access fields of the free article. `$granted` scopes are separate from other scopes, and do not give a request access to normal scopes of the same name. `$granted` scopes are also not inherited by nested children, and would need to be explicitly passed down for each field if you wanted to grant access to nested children.

### [Reusing checks for multiple, but not all fields](https://pothos-graphql.dev/docs/plugins/scope-auth#reusing-checks-for-multiple-but-not-all-fields)

You may have cases where groups of fields on a type are accessible using some shared condition. This is another case where `$granted` scopes can be helpful.

In the above example, `title`, `content`, and `viewCount` each use `$granted` scopes. In this case, rather than scopes being granted by the parent field, they are granted by the Article type itself. This allows the access to each field to change based on some dynamic conditions (if the request is from the author, and if the article is a draft) without having to duplicate that logic in each individual field.

### [Interfaces](https://pothos-graphql.dev/docs/plugins/scope-auth#interfaces)

Interfaces can define auth scopes on their fields the same way objects do. Fields for a type will run checks for each interface it implements separately, meaning that a request would need to satisfy the scope requirements for each interface separately before the field is resolved.

Object types can set `skipInterfaceScopes` to `true` to skip interface checks when resolving fields for that Object type.

### [Cache keys](https://pothos-graphql.dev/docs/plugins/scope-auth#cache-keys)

Auth scopes by default are cached based on the identity of the scope parameter. This works great for statically defined scopes, and scopes that take primitive values as their parameters. If you define auth scopes that take complex objects, and create those objects in a scope function (based on arguments, or parent values) You won't get cache hits on those checks.

To work around this, you can provide a `cacheKey` option to the builder for generating a cache key from your scope checks.

Above we are using `JSON.stringify` to generate a key. This will work for most complex objects, but you may want to consider something like `faster-stable-stringify` that can handle circular references, and swill always produce the same output regardless of the order of properties.

### [Scope Initializer](https://pothos-graphql.dev/docs/plugins/scope-auth#scope-initializer)

The scope initializer would be run once the first time a field protected by auth scopes is resolved, its result will be cached for the current request.

### [authScopes functions on fields](https://pothos-graphql.dev/docs/plugins/scope-auth#authscopes-functions-on-fields)

When using a function for `authScopes` on a field, the function will be run each time the field is resolved, since it has access to all the arguments passed to the resolver

### [authScopes functions on types](https://pothos-graphql.dev/docs/plugins/scope-auth#authscopes-functions-on-types)

When using a function for `authScopes` on a type, the function will be run the once for each instance of that type in the response. It will be run lazily when the first field for that object is resolved, and its result will be cached and reused by all fields for that instance of the type.

### [scope loaders](https://pothos-graphql.dev/docs/plugins/scope-auth#scope-loaders)

Scope loaders will be run run whenever a field requires the corresponding scope with a unique parameter. The scope loader results are cached per request based on a combination of the name of the scope, and its parameter.

### [grantScope on field](https://pothos-graphql.dev/docs/plugins/scope-auth#grantscope-on-field)

`grantScopes` on a field will run after the field is resolved, and is not cached

### [grantScope on type](https://pothos-graphql.dev/docs/plugins/scope-auth#grantscope-on-type)

`grantScopes` on a type (object or interface) will run when the first field on the type is resolved. It's result will be cached and reused for each field of the same instance of the type.

### [Types](https://pothos-graphql.dev/docs/plugins/scope-auth#types)

- `AuthScopes`: `extends {}`. Each property is the name of its scope, each value is the type for the scopes parameter.

- `ScopeLoaderMap`: Object who's keys are scope names (from `AuthScopes`) and whos values are either booleans (indicating whether or not the request has the scope) or function that take a parameter (type from `AuthScope`) and return `MaybePromise<boolean>`

- `ScopeMap`: A map of scope names to parameters. Based on `AuthScopes`, may also contain `$all`, `$any` or `$granted`.

### [Builder](https://pothos-graphql.dev/docs/plugins/scope-auth#builder)

- `authScopes`: (context: Types['Context']) =>`MaybePromise<ScopeLoaderMap<Types>>`

### [Object and Interface options](https://pothos-graphql.dev/docs/plugins/scope-auth#object-and-interface-options)

- `authScopes`: `ScopeMap` or `function`, accepts `parent` and `context` returns `MaybePromise<ScopeMap>`

- `grantScopes`: `function`, accepts `parent` and `context` returns `MaybePromise<string[]>`

### [Field Options](https://pothos-graphql.dev/docs/plugins/scope-auth#field-options)

- `authScopes`: `ScopeMap` or `function`, accepts same arguments as resolver, returns `MaybePromise<ScopeMap>`

- `grantScopes`: `string[]` or `function`, accepts same arguments as resolver, returns `MaybePromise<string[]>`

- `skipTypeScopes`: `boolean`

- `skipInterfaceScopes`: `boolean`

### [toSchema options](https://pothos-graphql.dev/docs/plugins/scope-auth#toschema-options)

- `disableScopeAuth`: disable the scope auth plugin. Useful for testing.

---

## URL: https://pothos-graphql.dev/docs/plugins/dataloader#loadable-objects

Title: Dataloader plugin

URL Source: https://pothos-graphql.dev/docs/plugins/dataloader

Markdown Content:
This plugin makes it easy to add fields and types that are loaded through a dataloader.

### [Install](https://pothos-graphql.dev/docs/plugins/dataloader#install)

To use the dataloader plugin you will need to install both the `dataloader` package and the Pothos dataloader plugin:

### [Setup](https://pothos-graphql.dev/docs/plugins/dataloader#setup)

### [loadable objects](https://pothos-graphql.dev/docs/plugins/dataloader#loadable-objects)

To create an object type that can be loaded with a dataloader use the new `builder.loadableObject` method:

It is **VERY IMPORTANT** to return values from `load` in an order that exactly matches the order of the requested IDs. The order is used to map results to their IDs, and if the results are returned in a different order, your GraphQL requests will end up with the wrong data. Correctly sorting results returned from a database or other data source can be tricky, so there this plugin has a `sort` option (described below) to simplify the sorting process. For more details on how the load function works, see the [dataloader docs](https://github.com/graphql/dataloader#batch-function).

When defining fields that return `User`s, you will now be able to return either a `string` (based in ids param of `load`), or a User object (type based on the return type of `loadUsersById`).

Pothos will detect when a resolver returns `string`, `number`, or `bigint` (typescript will constrain the allowed types to whatever is expected by the load function). If a resolver returns an object instead, Pothos knows it can skip the dataloader for that object.

### [loadable fields](https://pothos-graphql.dev/docs/plugins/dataloader#loadable-fields)

In some cases you may need more granular dataloaders. To handle these cases there is a new `t.loadable` method for defining fields with their own dataloaders.

### [loadableList fields for one-to-many relations](https://pothos-graphql.dev/docs/plugins/dataloader#loadablelist-fields-for-one-to-many-relations)

`loadable` fields can return lists, but do not work for loading a list of records from a single id.

The `loadableList` method can be used to define loadable fields that represent this kind of relationship.

### [loadableGroup fields for one-to-many relations](https://pothos-graphql.dev/docs/plugins/dataloader#loadablegroup-fields-for-one-to-many-relations)

In many cases, it's easier to load a flat list in a dataloader rather than loading a list of lists. the `loadableGroup` method simplifies this.

### [Accessing args on loadable fields](https://pothos-graphql.dev/docs/plugins/dataloader#accessing-args-on-loadable-fields)

By default the `load` method for fields does not have access to the fields arguments. This is because the dataloader will aggregate the calls across different selections and aliases that may not have the same arguments. To access the arguments, you can pass `byPath: true` in the fields options. This will cause the dataloader to only aggregate calls for the same "path" in the query, meaning all calls share the same arguments. This will allow you to access a 3rd `args` argument on the `load` method.

### [dataloader options](https://pothos-graphql.dev/docs/plugins/dataloader#dataloader-options)

You can provide additional options for your dataloaders using `loaderOptions`.

See [dataloader docs](https://github.com/graphql/dataloader#api) for all available options.

### [Manually using dataloader](https://pothos-graphql.dev/docs/plugins/dataloader#manually-using-dataloader)

Dataloaders for "loadable" objects can be accessed via their ref by passing in the context object for the current request. dataloaders are not shared across requests, so we need the context to get the correct dataloader for the current request:

### [Errors](https://pothos-graphql.dev/docs/plugins/dataloader#errors)

Calling dataloader.loadMany will resolve to a value like `(Type | Error)[]`. Your `load` function may also return results in that format if your loader can have parital failures. GraphQL does not have special handling for Error objects. Instead Pothos will map these results to something like `(Type | Promise<Type>)[]` where Errors are replaced with promises that will be rejected. This allows the normal graphql resolver flow to correctly handle these errors.

If you are using the `loadMany` method from a dataloader manually, you can apply the same mapping using the `rejectErrors` helper:

### [(Optional) Adding loaders to context](https://pothos-graphql.dev/docs/plugins/dataloader#optional-adding-loaders-to-context)

If you want to make dataloaders accessible via the context object directly, there is some additional setup required. Below are a few options for different ways you can load data from the context object. You can determine which of these options works best for you or add you own helpers.

First you'll need to update the types for your context type:

next you'll need to update your context factory function. The exact format of this depends on what graphql server implementation you are using.

Now you can use these helpers from your context object:

### [Using with the Relay plugin](https://pothos-graphql.dev/docs/plugins/dataloader#using-with-the-relay-plugin)

If you are using the Relay plugin, there is an additional method `loadableNode` that gets added to the builder. You can use this method to create `node` objects that work like other loadeble objects.

#### [Loadable connections](https://pothos-graphql.dev/docs/plugins/dataloader#loadable-connections)

To data-load a connection, you can use a combination of helpers:

- `builder.connectionObject` To create the connection and edge types
- `builder.loadable` with the `byPath` option to create a loadable field with access to arguments
- `t.arg.connectionArgs` to add the standard connection arguments to the field

### [Loadable Refs and Circular references](https://pothos-graphql.dev/docs/plugins/dataloader#loadable-refs-and-circular-references)

You may run into type errors if you define 2 loadable objects that circularly reference each other in their definitions.

There are a some general strategies to avoid this outlined in the [circular-references guide](https://pothos-graphql.dev/docs/guide/circular-references).

This plug also has methods for creating refs (similar to `builder.objectRef`) that can be used to split the definition and implementation of your types to avoid any issues with circular references.

All the plugin specific options should be passed when defining the ref. This allows the ref to be used by any method that accepts a ref to implement an object:

The above example is not useful on its own, but this pattern will allow these refs to be used with other that also allow you to define object types with additional behaviors.

### [Caching resources loaded manually in a resolver](https://pothos-graphql.dev/docs/plugins/dataloader#caching-resources-loaded-manually-in-a-resolver)

When manually loading a resource in a resolver it is not automatically added to the dataloader cache. If you want any resolved value to be stored in the cache in case it is used somewhere else in the query you can use the `cacheResolved` option.

The `cacheResolved` option takes a function that converts the loaded object into it's cache Key:

Whenever a resolver returns a User or list or Users, those objects will automatically be added the dataloaders cache, so they can be re-used in other parts of the query.

### [Sorting results from your `load` function](https://pothos-graphql.dev/docs/plugins/dataloader#sorting-results-from-your-load-function)

As mentioned above, the `load` function must return results in the same order as the provided array of IDs. Doing this correctly can be a little complicated, so this plugin includes an alternative. For any type or field that creates a dataloader, you can also provide a `sort` option which will correctly map your results into the correct order based on their ids. To do this, you will need to provide a function that accepts a result object, and returns its id.

This will also work with loadable nodes, interfaces, unions, or fields.

When sorting, if the list of results contains an Error the error is thrown because it can not be mapped to the correct location. This `sort` option should NOT be used for cases where the result list is expected to contain errors.

### [Shared `toKey` method.](https://pothos-graphql.dev/docs/plugins/dataloader#shared-tokey-method)

Defining multiple functions to extract the key from a loaded object can become redundant. In cases when you are using both `cacheResolved` and `sort` you can use a `toKey` function instead:

### [Subscriptions](https://pothos-graphql.dev/docs/plugins/dataloader#subscriptions)

Dataloaders are stored on the context object of the subscription. This means that values are cached across the full lifetime of the subscription.

To reset all data loaders for the current subscription, you can use the `clearAllDataLoaders` helper.

---

## URL: https://pothos-graphql.dev/docs/plugins/directives#setup

Title: Directive plugin

URL Source: https://pothos-graphql.dev/docs/plugins/directives

Markdown Content:
A plugin for using schema directives with schemas generated by Pothos.

Schema Directives are not intended to be used with code first schemas, but there is a large existing community with several very useful directives based

### [Install](https://pothos-graphql.dev/docs/plugins/directives#install)

### [Setup](https://pothos-graphql.dev/docs/plugins/directives#setup)

The directives plugin allows you to define types for the directives your schema will use the `SchemaTypes` parameter. Each directive can define a set of locations the directive can appear, and an object type representing the arguments the directive accepts.

The valid locations for directives are:

- `ARGUMENT_DEFINITION`
- `ENUM_VALUE`
- `ENUM`
- `FIELD_DEFINITION`
- `INPUT_FIELD_DEFINITION`
- `INPUT_OBJECT`
- `INTERFACE`
- `OBJECT`
- `SCALAR`
- `SCHEMA`
- `UNION`

Pothos does not apply the directives itself, this plugin simply adds directive information to the extensions property of the underlying GraphQL type so that it can be consumed by other tools like `graphql-tools`.

By default this plugin uses the format that Gatsby uses (described [here](https://github.com/graphql/graphql-js/issues/1343#issuecomment-479871020)). This format [was not supported by older versions of `graphql-tools`](https://github.com/ardatan/graphql-tools/issues/2534). To support older versions of `graphql-tools` or directives that provide a schema visitor based on an older graphql-tools version like the rate-limit directive from the example above you can set the `useGraphQLToolsUnorderedDirectives` option. This option does not preserve the order that directives are defined in. This will be okay for most cases, but may cause issues if your directives need to be applied in a specific order.

To define directives on your fields or types, you can add a `directives` property in any of the supported locations using one of the following 2 formats:

Each of these applies the same 2 directives. The first format is preferred, especially when using directives that are sensitive to ordering, or can be repeated multiple times for the same location.

For most locations (On fields and types) the options object for the field or type will have a `directives` option which can be used to define directives.

To apply `SCHEMA` directives, you can use the `schemaDirectives` option on the `toSchema` method. `directives` on `toSchema` is reserved for the Directive implementations.

---

## URL: https://pothos-graphql.dev/docs/plugins/errors#install

Title: Errors plugin

URL Source: https://pothos-graphql.dev/docs/plugins/errors

Markdown Content:
A plugin for easily including error types in your GraphQL schema and hooking up error types to resolvers

### [Install](https://pothos-graphql.dev/docs/plugins/errors#install)

### [Setup](https://pothos-graphql.dev/docs/plugins/errors#setup)

Ensure that the target in your `tsconfig.json` is set to `es6` or higher (default is `es3`).

### [Example Usage](https://pothos-graphql.dev/docs/plugins/errors#example-usage)

The above example will produce a GraphQL schema that looks like:

This field can be queried using fragments like:

This plugin works by wrapping fields that define error options in a union type. This union consists of an object type for each error type defined for the field, and a Success object type that wraps the returned data. If the fields resolver throws an instance of one of the defined errors, the errors plugin will automatically resolve to the corresponding error object type.

### [Builder options](https://pothos-graphql.dev/docs/plugins/errors#builder-options)

- `defaultTypes`: An array of Error classes to include in every field with error handling.
- `directResult`: Sets the default for `directResult` option on fields (only affects non-list fields)
- `defaultResultOptions`: Sets the defaults for `result` option on fields.

  - `name`: Function to generate a custom name on the generated result types.

- `defaultUnionOptions`: Sets the defaults for `result` option on fields.
  - `name`: Function to generate a custom name on the generated union types.

### [Options on Fields](https://pothos-graphql.dev/docs/plugins/errors#options-on-fields)

- `types`: An array of Error classes to catch and handle as error objects in the schema. Will be merged with `defaultTypes` from builder.
- `union`: An options object for the union type. Can include any normal union type options, and `name` option for setting a custom name for the union type.
- `result`: An options object for result object type. Can include any normal object type options, and `name` option for setting a custom name for the result type.
- `dataField`: An options object for the data field on the result object. This field will be named `data` by default, but can be written by passsing a custom `name` option.
- `directResult`: Boolean, can only be set to true for non-list fields. This will directly include the fields type in the union rather than creating an intermediate Result object type. This will throw at build time if the type is not an object type.

### [Recommended Usage](https://pothos-graphql.dev/docs/plugins/errors#recommended-usage)

1.  Set up an Error interface
2.  Create a BaseError object type
3.  Include the Error interface in any custom Error types you define
4.  Include the BaseError type in the `defaultTypes` in the builder config

This pattern will allow you to consistently query your schema using a `... on Error { message }` fragment since all Error classes extend that interface. If your client want's to query details of more specialized error types, they can just add a fragment for the errors it cares about. This pattern should also make it easier to make future changes without unexpected breaking changes for your clients.

The follow is a small example of this pattern:

### [With zod plugin](https://pothos-graphql.dev/docs/plugins/errors#with-zod-plugin)

To use this in combination with the zod plugin, ensure that that errors plugin is listed BEFORE the zod plugin in your plugin list.

Once your plugins are set up, you can define types for a ZodError, the same way you would for any other error type. Below is a simple example of how this can be done, but the specifics of how you structure your error types are left up to you.

Example query:

### [With the dataloader plugin](https://pothos-graphql.dev/docs/plugins/errors#with-the-dataloader-plugin)

To use this in combination with the dataloader plugin, ensure that that errors plugin is listed BEFORE the dataloader plugin in your plugin list.

If a field with `errors` returns a `loadableObject`, or `loadableNode` the errors plugin will now catch errors thrown when loading ids returned by the `resolve` function.

If the field is a `List` field, errors that occur when resolving objects from `ids` will not be handled by the errors plugin. This is because those errors are associated with each item in the list rather than the list field itself. In the future, the dataloader plugin may have an option to throw an error at the field level if any items can not be loaded, which would allow the error plugin to handle these types of errors.

### [With the prisma plugin](https://pothos-graphql.dev/docs/plugins/errors#with-the-prisma-plugin)

To use this in combination with the prisma plugin, ensure that that errors plugin is listed BEFORE the prisma plugin in your plugin list. This will enable `errors` option to work correctly with any field builder method from the prisma plugin.

`errors` can be configured for any field, but if there is an error pre-loading a relation the error will always surfaced at the field that executed the query. Because there are cases that fall back to executing queries for relation fields, these fields may still have errors if the relation was not pre-loaded. Detection of nested relations will continue to work if those relations use the `errors` plugin

### [List item errors](https://pothos-graphql.dev/docs/plugins/errors#list-item-errors)

For fields that return lists, you can specify `itemErrors` to wrap the list items in a union type so that errors can be handled per-item rather than replacing the whole list with an error.

The `itemErrors` options are exactly the same as the `errors` options, but they are applied to each item in the list rather than the whole list.

This will produce a GraphQL schema that looks like:

Item errors also works with both sync and async iterators (in graphql@>=17, or other executors that support the @stream directive):

When an error is yielded, an error result will be added into the list, if the generator throws an error, the error will be added to the list, and no more results will be returned for that field

You can also use the `errors` and `itemErrors` options together:

This will produce a GraphQL schema that looks like:

---

## URL: https://pothos-graphql.dev/docs/plugins/errors#recommended-usage

Title: Errors plugin

URL Source: https://pothos-graphql.dev/docs/plugins/errors

Markdown Content:
A plugin for easily including error types in your GraphQL schema and hooking up error types to resolvers

### [Install](https://pothos-graphql.dev/docs/plugins/errors#install)

### [Setup](https://pothos-graphql.dev/docs/plugins/errors#setup)

Ensure that the target in your `tsconfig.json` is set to `es6` or higher (default is `es3`).

### [Example Usage](https://pothos-graphql.dev/docs/plugins/errors#example-usage)

The above example will produce a GraphQL schema that looks like:

This field can be queried using fragments like:

This plugin works by wrapping fields that define error options in a union type. This union consists of an object type for each error type defined for the field, and a Success object type that wraps the returned data. If the fields resolver throws an instance of one of the defined errors, the errors plugin will automatically resolve to the corresponding error object type.

### [Builder options](https://pothos-graphql.dev/docs/plugins/errors#builder-options)

- `defaultTypes`: An array of Error classes to include in every field with error handling.
- `directResult`: Sets the default for `directResult` option on fields (only affects non-list fields)
- `defaultResultOptions`: Sets the defaults for `result` option on fields.

  - `name`: Function to generate a custom name on the generated result types.

- `defaultUnionOptions`: Sets the defaults for `result` option on fields.
  - `name`: Function to generate a custom name on the generated union types.

### [Options on Fields](https://pothos-graphql.dev/docs/plugins/errors#options-on-fields)

- `types`: An array of Error classes to catch and handle as error objects in the schema. Will be merged with `defaultTypes` from builder.
- `union`: An options object for the union type. Can include any normal union type options, and `name` option for setting a custom name for the union type.
- `result`: An options object for result object type. Can include any normal object type options, and `name` option for setting a custom name for the result type.
- `dataField`: An options object for the data field on the result object. This field will be named `data` by default, but can be written by passsing a custom `name` option.
- `directResult`: Boolean, can only be set to true for non-list fields. This will directly include the fields type in the union rather than creating an intermediate Result object type. This will throw at build time if the type is not an object type.

### [Recommended Usage](https://pothos-graphql.dev/docs/plugins/errors#recommended-usage)

1.  Set up an Error interface
2.  Create a BaseError object type
3.  Include the Error interface in any custom Error types you define
4.  Include the BaseError type in the `defaultTypes` in the builder config

This pattern will allow you to consistently query your schema using a `... on Error { message }` fragment since all Error classes extend that interface. If your client want's to query details of more specialized error types, they can just add a fragment for the errors it cares about. This pattern should also make it easier to make future changes without unexpected breaking changes for your clients.

The follow is a small example of this pattern:

### [With zod plugin](https://pothos-graphql.dev/docs/plugins/errors#with-zod-plugin)

To use this in combination with the zod plugin, ensure that that errors plugin is listed BEFORE the zod plugin in your plugin list.

Once your plugins are set up, you can define types for a ZodError, the same way you would for any other error type. Below is a simple example of how this can be done, but the specifics of how you structure your error types are left up to you.

Example query:

### [With the dataloader plugin](https://pothos-graphql.dev/docs/plugins/errors#with-the-dataloader-plugin)

To use this in combination with the dataloader plugin, ensure that that errors plugin is listed BEFORE the dataloader plugin in your plugin list.

If a field with `errors` returns a `loadableObject`, or `loadableNode` the errors plugin will now catch errors thrown when loading ids returned by the `resolve` function.

If the field is a `List` field, errors that occur when resolving objects from `ids` will not be handled by the errors plugin. This is because those errors are associated with each item in the list rather than the list field itself. In the future, the dataloader plugin may have an option to throw an error at the field level if any items can not be loaded, which would allow the error plugin to handle these types of errors.

### [With the prisma plugin](https://pothos-graphql.dev/docs/plugins/errors#with-the-prisma-plugin)

To use this in combination with the prisma plugin, ensure that that errors plugin is listed BEFORE the prisma plugin in your plugin list. This will enable `errors` option to work correctly with any field builder method from the prisma plugin.

`errors` can be configured for any field, but if there is an error pre-loading a relation the error will always surfaced at the field that executed the query. Because there are cases that fall back to executing queries for relation fields, these fields may still have errors if the relation was not pre-loaded. Detection of nested relations will continue to work if those relations use the `errors` plugin

### [List item errors](https://pothos-graphql.dev/docs/plugins/errors#list-item-errors)

For fields that return lists, you can specify `itemErrors` to wrap the list items in a union type so that errors can be handled per-item rather than replacing the whole list with an error.

The `itemErrors` options are exactly the same as the `errors` options, but they are applied to each item in the list rather than the whole list.

This will produce a GraphQL schema that looks like:

Item errors also works with both sync and async iterators (in graphql@>=17, or other executors that support the @stream directive):

When an error is yielded, an error result will be added into the list, if the generator throws an error, the error will be added to the list, and no more results will be returned for that field

You can also use the `errors` and `itemErrors` options together:

This will produce a GraphQL schema that looks like:

---

## URL: https://pothos-graphql.dev/docs/plugins/mocks#setup

Title: Mocks plugin

URL Source: https://pothos-graphql.dev/docs/plugins/mocks

Markdown Content:
Mocks plugin

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 1: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Add GraphQL plugin](https://pothos-graphql.dev/docs/plugins/add-graphql)[Complexity plugin](https://pothos-graphql.dev/docs/plugins/complexity)[Dataloader plugin](https://pothos-graphql.dev/docs/plugins/dataloader)[Directive plugin](https://pothos-graphql.dev/docs/plugins/directives)[Drizzle plugin](https://pothos-graphql.dev/docs/plugins/drizzle)[Errors plugin](https://pothos-graphql.dev/docs/plugins/errors)[Federation plugin](https://pothos-graphql.dev/docs/plugins/federation)[Mocks plugin](https://pothos-graphql.dev/docs/plugins/mocks)[Relay plugin](https://pothos-graphql.dev/docs/plugins/relay)[Auth plugin](https://pothos-graphql.dev/docs/plugins/scope-auth)[Simple objects plugin](https://pothos-graphql.dev/docs/plugins/simple-objects)[Smart subscriptions plugin](https://pothos-graphql.dev/docs/plugins/smart-subscriptions)[SubGraph plugin](https://pothos-graphql.dev/docs/plugins/sub-graph)[Tracing plugin](https://pothos-graphql.dev/docs/plugins/tracing)[With-Input plugin](https://pothos-graphql.dev/docs/plugins/with-input)[Zod Validation plugin](https://pothos-graphql.dev/docs/plugins/zod)

[Prisma](https://pothos-graphql.dev/docs/plugins/prisma)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

Mocks plugin Usage

[Plugins](https://pothos-graphql.dev/docs/plugins)

# Mocks plugin

A simple plugin for adding resolver mocks to a GraphQL schema.

## [Usage](https://pothos-graphql.dev/docs/plugins/mocks#usage)

### [Install](https://pothos-graphql.dev/docs/plugins/mocks#install)

npm pnpm yarn bun

`npm install --save @pothos/plugin-mocks`

### [Setup](https://pothos-graphql.dev/docs/plugins/mocks#setup)

```
import MocksPlugin from '@pothos/plugin-mocks';
const builder = new SchemaBuilder({
  plugins: [MocksPlugin],
});
```

### [Adding mocks](https://pothos-graphql.dev/docs/plugins/mocks#adding-mocks)

You can mock any field by adding a mock in the options passed to `builder.toSchema` under `mocks.{typeName}.{fieldName}`.

```
builder.queryType({
  fields: (t) => ({
    someField: t.string({
      resolve: () => {
        throw new Error('Not implemented');
      },
    }),
  }),
});

builder.toSchema({
  mocks: {
    Query: {
      someField: (parent, args, context, info) => 'Mock result!',
    },
  },
});
```

Mocks will replace the resolve functions any time a mocked field is executed. A schema can be built multiple times with different mocks.

### [Adding mocks for subscribe functions](https://pothos-graphql.dev/docs/plugins/mocks#adding-mocks-for-subscribe-functions)

To add a mock for a subscriber you can nest the mocks for subscribe and resolve in an object:

```
builder.subscriptionType({
  fields: (t) => ({
    someField: t.string({
      resolve: () => {
        throw new Error('Not implemented');
      },
      subscribe: () => {
        throw new Error('Not implemented');
      },
    }),
  }),
});

builder.toSchema({
  mocks: {
    Subscription: {
      someField: {
        resolve: (parent, args, context, info) => 'Mock result!',
        subscribe: (parent, args, context, info) => {
          /* return a mock async iterator */
        },
      },
    },
  },
});
```

[Federation plugin Federation plugin docs for Pothos](https://pothos-graphql.dev/docs/plugins/federation)[Relay plugin Relay plugin docs for Pothos](https://pothos-graphql.dev/docs/plugins/relay)

### On this page

[Usage](https://pothos-graphql.dev/docs/plugins/mocks#usage)[Install](https://pothos-graphql.dev/docs/plugins/mocks#install)[Setup](https://pothos-graphql.dev/docs/plugins/mocks#setup)[Adding mocks](https://pothos-graphql.dev/docs/plugins/mocks#adding-mocks)[Adding mocks for subscribe functions](https://pothos-graphql.dev/docs/plugins/mocks#adding-mocks-for-subscribe-functions)

---

## URL: https://pothos-graphql.dev/docs/plugins/mocks#adding-mocks

Title: Mocks plugin

URL Source: https://pothos-graphql.dev/docs/plugins/mocks

Markdown Content:
Mocks plugin

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 1: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Add GraphQL plugin](https://pothos-graphql.dev/docs/plugins/add-graphql)[Complexity plugin](https://pothos-graphql.dev/docs/plugins/complexity)[Dataloader plugin](https://pothos-graphql.dev/docs/plugins/dataloader)[Directive plugin](https://pothos-graphql.dev/docs/plugins/directives)[Drizzle plugin](https://pothos-graphql.dev/docs/plugins/drizzle)[Errors plugin](https://pothos-graphql.dev/docs/plugins/errors)[Federation plugin](https://pothos-graphql.dev/docs/plugins/federation)[Mocks plugin](https://pothos-graphql.dev/docs/plugins/mocks)[Relay plugin](https://pothos-graphql.dev/docs/plugins/relay)[Auth plugin](https://pothos-graphql.dev/docs/plugins/scope-auth)[Simple objects plugin](https://pothos-graphql.dev/docs/plugins/simple-objects)[Smart subscriptions plugin](https://pothos-graphql.dev/docs/plugins/smart-subscriptions)[SubGraph plugin](https://pothos-graphql.dev/docs/plugins/sub-graph)[Tracing plugin](https://pothos-graphql.dev/docs/plugins/tracing)[With-Input plugin](https://pothos-graphql.dev/docs/plugins/with-input)[Zod Validation plugin](https://pothos-graphql.dev/docs/plugins/zod)

[Prisma](https://pothos-graphql.dev/docs/plugins/prisma)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

Mocks plugin Usage

[Plugins](https://pothos-graphql.dev/docs/plugins)

# Mocks plugin

A simple plugin for adding resolver mocks to a GraphQL schema.

## [Usage](https://pothos-graphql.dev/docs/plugins/mocks#usage)

### [Install](https://pothos-graphql.dev/docs/plugins/mocks#install)

npm pnpm yarn bun

`npm install --save @pothos/plugin-mocks`

### [Setup](https://pothos-graphql.dev/docs/plugins/mocks#setup)

```
import MocksPlugin from '@pothos/plugin-mocks';
const builder = new SchemaBuilder({
  plugins: [MocksPlugin],
});
```

### [Adding mocks](https://pothos-graphql.dev/docs/plugins/mocks#adding-mocks)

You can mock any field by adding a mock in the options passed to `builder.toSchema` under `mocks.{typeName}.{fieldName}`.

```
builder.queryType({
  fields: (t) => ({
    someField: t.string({
      resolve: () => {
        throw new Error('Not implemented');
      },
    }),
  }),
});

builder.toSchema({
  mocks: {
    Query: {
      someField: (parent, args, context, info) => 'Mock result!',
    },
  },
});
```

Mocks will replace the resolve functions any time a mocked field is executed. A schema can be built multiple times with different mocks.

### [Adding mocks for subscribe functions](https://pothos-graphql.dev/docs/plugins/mocks#adding-mocks-for-subscribe-functions)

To add a mock for a subscriber you can nest the mocks for subscribe and resolve in an object:

```
builder.subscriptionType({
  fields: (t) => ({
    someField: t.string({
      resolve: () => {
        throw new Error('Not implemented');
      },
      subscribe: () => {
        throw new Error('Not implemented');
      },
    }),
  }),
});

builder.toSchema({
  mocks: {
    Subscription: {
      someField: {
        resolve: (parent, args, context, info) => 'Mock result!',
        subscribe: (parent, args, context, info) => {
          /* return a mock async iterator */
        },
      },
    },
  },
});
```

[Federation plugin Federation plugin docs for Pothos](https://pothos-graphql.dev/docs/plugins/federation)[Relay plugin Relay plugin docs for Pothos](https://pothos-graphql.dev/docs/plugins/relay)

### On this page

[Usage](https://pothos-graphql.dev/docs/plugins/mocks#usage)[Install](https://pothos-graphql.dev/docs/plugins/mocks#install)[Setup](https://pothos-graphql.dev/docs/plugins/mocks#setup)[Adding mocks](https://pothos-graphql.dev/docs/plugins/mocks#adding-mocks)[Adding mocks for subscribe functions](https://pothos-graphql.dev/docs/plugins/mocks#adding-mocks-for-subscribe-functions)

---

## URL: https://pothos-graphql.dev/docs/plugins/mocks#adding-mocks-for-subscribe-functions

Title: Mocks plugin

URL Source: https://pothos-graphql.dev/docs/plugins/mocks

Markdown Content:
Mocks plugin

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 1: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Add GraphQL plugin](https://pothos-graphql.dev/docs/plugins/add-graphql)[Complexity plugin](https://pothos-graphql.dev/docs/plugins/complexity)[Dataloader plugin](https://pothos-graphql.dev/docs/plugins/dataloader)[Directive plugin](https://pothos-graphql.dev/docs/plugins/directives)[Drizzle plugin](https://pothos-graphql.dev/docs/plugins/drizzle)[Errors plugin](https://pothos-graphql.dev/docs/plugins/errors)[Federation plugin](https://pothos-graphql.dev/docs/plugins/federation)[Mocks plugin](https://pothos-graphql.dev/docs/plugins/mocks)[Relay plugin](https://pothos-graphql.dev/docs/plugins/relay)[Auth plugin](https://pothos-graphql.dev/docs/plugins/scope-auth)[Simple objects plugin](https://pothos-graphql.dev/docs/plugins/simple-objects)[Smart subscriptions plugin](https://pothos-graphql.dev/docs/plugins/smart-subscriptions)[SubGraph plugin](https://pothos-graphql.dev/docs/plugins/sub-graph)[Tracing plugin](https://pothos-graphql.dev/docs/plugins/tracing)[With-Input plugin](https://pothos-graphql.dev/docs/plugins/with-input)[Zod Validation plugin](https://pothos-graphql.dev/docs/plugins/zod)

[Prisma](https://pothos-graphql.dev/docs/plugins/prisma)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

Mocks plugin Usage

[Plugins](https://pothos-graphql.dev/docs/plugins)

# Mocks plugin

A simple plugin for adding resolver mocks to a GraphQL schema.

## [Usage](https://pothos-graphql.dev/docs/plugins/mocks#usage)

### [Install](https://pothos-graphql.dev/docs/plugins/mocks#install)

npm pnpm yarn bun

`npm install --save @pothos/plugin-mocks`

### [Setup](https://pothos-graphql.dev/docs/plugins/mocks#setup)

```
import MocksPlugin from '@pothos/plugin-mocks';
const builder = new SchemaBuilder({
  plugins: [MocksPlugin],
});
```

### [Adding mocks](https://pothos-graphql.dev/docs/plugins/mocks#adding-mocks)

You can mock any field by adding a mock in the options passed to `builder.toSchema` under `mocks.{typeName}.{fieldName}`.

```
builder.queryType({
  fields: (t) => ({
    someField: t.string({
      resolve: () => {
        throw new Error('Not implemented');
      },
    }),
  }),
});

builder.toSchema({
  mocks: {
    Query: {
      someField: (parent, args, context, info) => 'Mock result!',
    },
  },
});
```

Mocks will replace the resolve functions any time a mocked field is executed. A schema can be built multiple times with different mocks.

### [Adding mocks for subscribe functions](https://pothos-graphql.dev/docs/plugins/mocks#adding-mocks-for-subscribe-functions)

To add a mock for a subscriber you can nest the mocks for subscribe and resolve in an object:

```
builder.subscriptionType({
  fields: (t) => ({
    someField: t.string({
      resolve: () => {
        throw new Error('Not implemented');
      },
      subscribe: () => {
        throw new Error('Not implemented');
      },
    }),
  }),
});

builder.toSchema({
  mocks: {
    Subscription: {
      someField: {
        resolve: (parent, args, context, info) => 'Mock result!',
        subscribe: (parent, args, context, info) => {
          /* return a mock async iterator */
        },
      },
    },
  },
});
```

[Federation plugin Federation plugin docs for Pothos](https://pothos-graphql.dev/docs/plugins/federation)[Relay plugin Relay plugin docs for Pothos](https://pothos-graphql.dev/docs/plugins/relay)

### On this page

[Usage](https://pothos-graphql.dev/docs/plugins/mocks#usage)[Install](https://pothos-graphql.dev/docs/plugins/mocks#install)[Setup](https://pothos-graphql.dev/docs/plugins/mocks#setup)[Adding mocks](https://pothos-graphql.dev/docs/plugins/mocks#adding-mocks)[Adding mocks for subscribe functions](https://pothos-graphql.dev/docs/plugins/mocks#adding-mocks-for-subscribe-functions)

---

## URL: https://pothos-graphql.dev/docs/plugins/prisma/setup

Title: Setup

URL Source: https://pothos-graphql.dev/docs/plugins/prisma/setup

Markdown Content:
This plugin requires a little more setup than other plugins because it integrates with the prisma to generate some types that help the plugin better understand your prisma schema. Previous versions of this plugin used to infer all required types from the prisma client itself, but this resulted in a poor dev experience because the complex types slowed down editors, and some more advanced use cases could not be typed correctly.

### [Add a the `pothos` generator to your prisma schema](https://pothos-graphql.dev/docs/plugins/prisma/setup#add-a-the-pothos-generator-to-your-prisma-schema)

Now the types Pothos uses will be generated whenever you re-generate your prisma client. Run the following command to re-generate the client and create the new types:

additional options:

- `clientOutput`: Where the generated code will import the PrismaClient from. The default is the full path of wherever the client is generated. If you are checking in the generated file, using `@prisma/client` is a good option.
- `output`: Where to write the generated types

Example with more options:

When using the new `prisma-client` generator, the `clientOutput` option should match the `output` option of the `prisma-client` generator:

### [Set up the builder](https://pothos-graphql.dev/docs/plugins/prisma/setup#set-up-the-builder)

It is strongly recommended NOT to put your prisma client into `Context`. This will result in slower type-checking and a laggy developer experience in VSCode. See [this issue](https://github.com/microsoft/TypeScript/issues/45405) for more details.

You can also load or create the prisma client dynamically for each request. This can be used to periodically re-create clients or create read-only clients for certain types of users.

When prisma is built for edge run-times like cloudflare workers, the prisma client no-longer exposes the dmmf datamodel Pothos uses when building the schema. To work around this, you can have the pothos generator generate the datamodel instead:

When using the `generateDatamodel` option, the prisma client will add a `getDatamodel` function in the generated output. When using this option, you should be using a `.ts` file rather than a `.d.ts` file for the output.

When setting up the builder, you can now use the `getDatamodel` function:

Forgetting to spread the `query` argument from `t.prismaField` or `t.prismaConnection` into your prisma query can result in inefficient queries, or even missing data. To help catch these issues, the plugin can warn you when you are not using the query argument correctly.

the `onUnusedQuery` option can be set to `warn` or `error` to enable this feature. When set to `warn` it will log a warning to the console if Pothos detects that you have not properly used the query in your resolver. Similarly if you set the option to `error` it will throw an error instead. You can also pass a function which will receive the `info` object which can be used to log or throw your own error.

This check is fairly naive and works by wrapping the properties on the query with a getter that sets a flag if the property is accessed. If no properties are accessed on the query object before the resolver returns, it will trigger the `onUnusedQuery` condition.

It's recommended to enable this check in development to more quickly find potential issues.

---

## URL: https://pothos-graphql.dev/docs/plugins/prisma/objects

Title: Prisma Objects

URL Source: https://pothos-graphql.dev/docs/plugins/prisma/objects

Markdown Content:
Prisma Objects

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 1: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Add GraphQL plugin](https://pothos-graphql.dev/docs/plugins/add-graphql)[Complexity plugin](https://pothos-graphql.dev/docs/plugins/complexity)[Dataloader plugin](https://pothos-graphql.dev/docs/plugins/dataloader)[Directive plugin](https://pothos-graphql.dev/docs/plugins/directives)[Drizzle plugin](https://pothos-graphql.dev/docs/plugins/drizzle)[Errors plugin](https://pothos-graphql.dev/docs/plugins/errors)[Federation plugin](https://pothos-graphql.dev/docs/plugins/federation)[Mocks plugin](https://pothos-graphql.dev/docs/plugins/mocks)[Relay plugin](https://pothos-graphql.dev/docs/plugins/relay)[Auth plugin](https://pothos-graphql.dev/docs/plugins/scope-auth)[Simple objects plugin](https://pothos-graphql.dev/docs/plugins/simple-objects)[Smart subscriptions plugin](https://pothos-graphql.dev/docs/plugins/smart-subscriptions)[SubGraph plugin](https://pothos-graphql.dev/docs/plugins/sub-graph)[Tracing plugin](https://pothos-graphql.dev/docs/plugins/tracing)[With-Input plugin](https://pothos-graphql.dev/docs/plugins/with-input)[Zod Validation plugin](https://pothos-graphql.dev/docs/plugins/zod)

[Prisma](https://pothos-graphql.dev/docs/plugins/prisma)

[Setup](https://pothos-graphql.dev/docs/plugins/prisma/setup)[Prisma Objects](https://pothos-graphql.dev/docs/plugins/prisma/objects)[Relations](https://pothos-graphql.dev/docs/plugins/prisma/relations)[Selections](https://pothos-graphql.dev/docs/plugins/prisma/selections)[Relay](https://pothos-graphql.dev/docs/plugins/prisma/relay)[Connections](https://pothos-graphql.dev/docs/plugins/prisma/connections)[Type variants](https://pothos-graphql.dev/docs/plugins/prisma/variants)[Indirect relations](https://pothos-graphql.dev/docs/plugins/prisma/indirect-relations)[Interfaces](https://pothos-graphql.dev/docs/plugins/prisma/interfaces)[Prisma Utils](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils)[Prisma without a plugin](https://pothos-graphql.dev/docs/plugins/prisma/without-a-plugin)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

Prisma Objects

[Plugins](https://pothos-graphql.dev/docs/plugins)/[Prisma](https://pothos-graphql.dev/docs/plugins/prisma)

# Prisma Objects

## [Creating types with `builder.prismaObject`](https://pothos-graphql.dev/docs/plugins/prisma/objects#creating-types-with-builderprismaobject)

`builder.prismaObject` takes 2 arguments:

1.  `name`: The name of the prisma model this new type represents
2.  `options`: options for the type being created, this is very similar to the options for any other object type

```
builder.prismaObject('User', {
  // Optional name for the object, defaults to the name of the prisma model
  name: 'PostAuthor',
  fields: (t) => ({
    id: t.exposeID('id'),
    email: t.exposeString('email'),
  }),
});

builder.prismaObject('Post', {
  fields: (t) => ({
    id: t.exposeID('id'),
    title: t.exposeString('title'),
  }),
});
```

So far, this is just creating some simple object types. They work just like any other object type in Pothos. The main advantage of this is that we get the type information without using object refs, or needing imports from prisma client.

## [Adding prisma fields to non-prisma objects (including Query and Mutation)](https://pothos-graphql.dev/docs/plugins/prisma/objects#adding-prisma-fields-to-non-prisma-objects-including-query-and-mutation)

There is a new `t.prismaField` method which can be used to define fields that resolve to your prisma types:

```
builder.queryType({
  fields: (t) => ({
    me: t.prismaField({
      type: 'User',
      resolve: async (query, root, args, ctx, info) =>
        prisma.user.findUniqueOrThrow({
          ...query,
          where: { id: ctx.userId },
        }),
    }),
  }),
});
```

This method works just like the normal `t.field` method with a couple of differences:

1.  The `type` option must contain the name of the prisma model (eg. `User` or `[User]` for a list field).
2.  The `resolve` function has a new first argument `query` which should be spread into query prisma query. This will be used to load data for nested relationships.

You do not need to use this method, and the `builder.prismaObject` method returns an object ref than can be used like any other object ref (with `t.field`), but using `t.prismaField` will allow you to take advantage of more efficient queries.

The `query` object will contain an object with `include` or `select` options to pre-load data needed to resolve nested parts of the current query. The included/selected fields are based on which fields are being queried, and the options provided when defining those fields and types.

## [Extending prisma objects](https://pothos-graphql.dev/docs/plugins/prisma/objects#extending-prisma-objects)

The normal `builder.objectField(s)` methods can be used to extend prisma objects, but do not support using selections, or exposing fields not in the default selection. To use these features, you can use

`builder.prismaObjectField` or `builder.prismaObjectFields` instead.

[Setup Setting up the Prisma plugin](https://pothos-graphql.dev/docs/plugins/prisma/setup)[Relations Adding relations to prism objects](https://pothos-graphql.dev/docs/plugins/prisma/relations)

### On this page

[Creating types with `builder.prismaObject`](https://pothos-graphql.dev/docs/plugins/prisma/objects#creating-types-with-builderprismaobject)[Adding prisma fields to non-prisma objects (including Query and Mutation)](https://pothos-graphql.dev/docs/plugins/prisma/objects#adding-prisma-fields-to-non-prisma-objects-including-query-and-mutation)[Extending prisma objects](https://pothos-graphql.dev/docs/plugins/prisma/objects#extending-prisma-objects)

---

## URL: https://pothos-graphql.dev/docs/plugins/prisma/relations

Title: Relations

URL Source: https://pothos-graphql.dev/docs/plugins/prisma/relations

Markdown Content:
You can add fields for relations using the `t.relation` method:

`t.relation` defines a field that can be pre-loaded by a parent resolver. This will create something like `{ include: { author: true }}` that will be passed as part of the `query` argument of a `prismaField` resolver. If the parent is another `relation` field, the includes will become nested, and the full relation chain will be passed to the `prismaField` that started the chain.

For example the query:

the ` me``prismaField ` would receive something like the following as its query parameter:

This will work perfectly for the majority of queries. There are a number of edge cases that make it impossible to resolve everything in a single query. When this happens Pothos will automatically construct an additional query to ensure that everything is still loaded correctly, and split into as few efficient queries as possible. This process is described in more detail below

### [Fallback queries](https://pothos-graphql.dev/docs/plugins/prisma/relations#fallback-queries)

There are some cases where data can not be pre-loaded by a prisma field. In these cases, pothos will issue a `findUnique` query for the parent of any fields that were not pre-loaded, and select the missing relations so those fields can be resolved with the correct data. These queries should be very efficient, are batched by pothos to combine requirements for multiple fields into one query, and batched by Prisma to combine multiple queries (in an n+1 situation) to a single sql query.

The following are some edge cases that could cause an additional query to be necessary:

- The parent object was not loaded through a field defined with `t.prismaField`, or `t.relation`
- The root `prismaField` did not correctly spread the `query` arguments in is prisma call.
- The query selects multiple fields that use the same relation with different filters, sorting, or limits
- The query contains multiple aliases for the same relation field with different arguments in a way that results in different query options for the relation.
- A relation field has a query that is incompatible with the default includes of the parent object

All of the above should be relatively uncommon in normal usage, but the plugin ensures that these types of edge cases are automatically handled when they do occur.

### [Filters, Sorting, and arguments](https://pothos-graphql.dev/docs/plugins/prisma/relations#filters-sorting-and-arguments)

So far we have been describing very simple queries without any arguments, filtering, or sorting. For `t.prismaField` definitions, you can add arguments to your field like normal, and pass them into your prisma query as needed. For `t.relation` the flow is slightly different because we are not making a prisma query directly. We do this by adding a `query` option to our field options. Query can either be a query object, or a method that returns a query object based on the field arguments.

The returned query object will be added to the include section of the `query` argument that gets passed into the first argument of the parent `t.prismaField`, and can include things like `where`, `skip`, `take`, and `orderBy`. The `query` function will be passed the arguments for the field, and the context for the current request. Because it is used for pre-loading data, and solving n+1 issues, it can not be passed the `parent` object because it may not be loaded yet.

### [relationCount](https://pothos-graphql.dev/docs/plugins/prisma/relations#relationcount)

Prisma supports querying for [relation counts](https://www.prisma.io/docs/concepts/components/prisma-client/aggregation-grouping-summarizing#count-relations) which allow including counts for relations along side other `includes`. Before prisma 4.2.0, this does not support any filters on the counts, but can give a total count for a relation. Starting from prisma 4.2.0, filters on relation count are available under the `filteredRelationCount` preview feature flag.

---

## URL: https://pothos-graphql.dev/docs/plugins/prisma/selections

Title: Selections

URL Source: https://pothos-graphql.dev/docs/plugins/prisma/selections

Markdown Content:
Selections

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 1: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Add GraphQL plugin](https://pothos-graphql.dev/docs/plugins/add-graphql)[Complexity plugin](https://pothos-graphql.dev/docs/plugins/complexity)[Dataloader plugin](https://pothos-graphql.dev/docs/plugins/dataloader)[Directive plugin](https://pothos-graphql.dev/docs/plugins/directives)[Drizzle plugin](https://pothos-graphql.dev/docs/plugins/drizzle)[Errors plugin](https://pothos-graphql.dev/docs/plugins/errors)[Federation plugin](https://pothos-graphql.dev/docs/plugins/federation)[Mocks plugin](https://pothos-graphql.dev/docs/plugins/mocks)[Relay plugin](https://pothos-graphql.dev/docs/plugins/relay)[Auth plugin](https://pothos-graphql.dev/docs/plugins/scope-auth)[Simple objects plugin](https://pothos-graphql.dev/docs/plugins/simple-objects)[Smart subscriptions plugin](https://pothos-graphql.dev/docs/plugins/smart-subscriptions)[SubGraph plugin](https://pothos-graphql.dev/docs/plugins/sub-graph)[Tracing plugin](https://pothos-graphql.dev/docs/plugins/tracing)[With-Input plugin](https://pothos-graphql.dev/docs/plugins/with-input)[Zod Validation plugin](https://pothos-graphql.dev/docs/plugins/zod)

[Prisma](https://pothos-graphql.dev/docs/plugins/prisma)

[Setup](https://pothos-graphql.dev/docs/plugins/prisma/setup)[Prisma Objects](https://pothos-graphql.dev/docs/plugins/prisma/objects)[Relations](https://pothos-graphql.dev/docs/plugins/prisma/relations)[Selections](https://pothos-graphql.dev/docs/plugins/prisma/selections)[Relay](https://pothos-graphql.dev/docs/plugins/prisma/relay)[Connections](https://pothos-graphql.dev/docs/plugins/prisma/connections)[Type variants](https://pothos-graphql.dev/docs/plugins/prisma/variants)[Indirect relations](https://pothos-graphql.dev/docs/plugins/prisma/indirect-relations)[Interfaces](https://pothos-graphql.dev/docs/plugins/prisma/interfaces)[Prisma Utils](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils)[Prisma without a plugin](https://pothos-graphql.dev/docs/plugins/prisma/without-a-plugin)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

Selections

[Plugins](https://pothos-graphql.dev/docs/plugins)/[Prisma](https://pothos-graphql.dev/docs/plugins/prisma)

# Selections

## [Includes on types](https://pothos-graphql.dev/docs/plugins/prisma/selections#includes-on-types)

In some cases, you may want to always pre-load certain relations. This can be helpful for defining fields directly on type where the underlying data may come from a related table.

```
builder.prismaObject('User', {
  // This will always include the profile when a user object is loaded.  Deeply nested relations can
  // also be included this way.
  include: {
    profile: true,
  },
  fields: (t) => ({
    id: t.exposeID('id'),
    email: t.exposeString('email'),
    bio: t.string({
      // The profile relation will always be loaded, and user will now be typed to include the
      // profile field so you can return the bio from the nested profile relation.
      resolve: (user) => user.profile.bio,
    }),
  }),
});
```

## [Select mode for types](https://pothos-graphql.dev/docs/plugins/prisma/selections#select-mode-for-types)

By default, the prisma plugin will use `include` when including relations, or generating fallback queries. This means we are always loading all columns of a table when loading it in a `t.prismaField` or a `t.relation`. This is usually what we want, but in some cases, you may want to select specific columns instead. This can be useful if you have tables with either a very large number of columns, or specific columns with large payloads you want to avoid loading.

To do this, you can add a `select` instead of an include to your `prismaObject`:

```
builder.prismaObject('User', {
  select: {
    id: true,
  },
  fields: (t) => ({
    id: t.exposeID('id'),
    email: t.exposeString('email'),
  }),
});
```

The `t.expose*` and `t.relation` methods will all automatically add selections for the exposed fields _WHEN THEY ARE QUERIED_, ensuring that only the requested columns will be loaded from the database.

In addition to the `t.expose` and `t.relation`, you can also add custom selections to other fields:

```
builder.prismaObject('User', {
  select: {
    id: true,
  },
  fields: (t) => ({
    id: t.exposeID('id'),
    email: t.exposeString('email'),
    bio: t.string({
      // This will select user.profile.bio when the the `bio` field is queried
      select: {
        profile: {
          select: {
            bio: true,
          },
        },
      },
      resolve: (user) => user.profile.bio,
    }),
  }),
});
```

## [Using arguments or context in your selections](https://pothos-graphql.dev/docs/plugins/prisma/selections#using-arguments-or-context-in-your-selections)

The following is a slightly contrived example, but shows how arguments can be used when creating a selection for a field:

```
const PostDraft = builder.prismaObject('Post', {
  fields: (t) => ({
    title: t.exposeString('title'),
    commentFromDate: t.string({
      args: {
        date: t.arg({ type: 'Date', required: true }),
      },
      select: (args) => ({
        comments: {
          take: 1,
          where: {
            createdAt: {
              gt: args.date,
            },
          },
        },
      }),
      resolve: (post) => post.comments[0]?.content,
    }),
  }),
});
```

## [Optimized queries without `t.prismaField`](https://pothos-graphql.dev/docs/plugins/prisma/selections#optimized-queries-without-tprismafield)

In some cases, it may be useful to get an optimized query for fields where you can't use `t.prismaField`.

This may be required for combining with other plugins, or because your query does not directly return a `PrismaObject`. In these cases, you can use the `queryFromInfo` helper. An example of this might be a mutation that wraps the prisma object in a result type.

```
const Post = builder.prismaObject('Post', {...});

builder.objectRef<{
  success: boolean;
  post?: Post
  }>('CreatePostResult').implement({
  fields: (t) => ({
    success: t.boolean(),
    post: t.field({
      type: Post,
      nullable:
      resolve: (result) => result.post,
    }),
  }),
});

builder.mutationField(
  'createPost',
  {
    args: (t) => ({
      title: t.string({ required: true }),
      ...
    }),
  },
  {
    resolve: async (parent, args, context, info) => {
      if (!validateCreatePostArgs(args)) {
        return {
          success: false,
        }
      }

      const post = prisma.city.create({
        ...queryFromInfo({
          context,
          info,
          // nested path where the selections for this type can be found
          path: ['post']
          // optionally you can pass a custom initial selection, generally you wouldn't need this
          // but if the field at `path` is not selected, the initial selection set may be empty
          select: {
            comments: true,
          },
        }),
        data: {
          title: args.input.title,
          ...
        },
      });

      return {
        success: true,
        post,
      }
    },
  },
);
```

[Relations Adding relations to prism objects](https://pothos-graphql.dev/docs/plugins/prisma/relations)[Relay Using the Prisma and Relay plugins together](https://pothos-graphql.dev/docs/plugins/prisma/relay)

### On this page

[Includes on types](https://pothos-graphql.dev/docs/plugins/prisma/selections#includes-on-types)[Select mode for types](https://pothos-graphql.dev/docs/plugins/prisma/selections#select-mode-for-types)[Using arguments or context in your selections](https://pothos-graphql.dev/docs/plugins/prisma/selections#using-arguments-or-context-in-your-selections)[Optimized queries without `t.prismaField`](https://pothos-graphql.dev/docs/plugins/prisma/selections#optimized-queries-without-tprismafield)

---

## URL: https://pothos-graphql.dev/docs/plugins/prisma/relay

Title: Relay

URL Source: https://pothos-graphql.dev/docs/plugins/prisma/relay

Markdown Content:
This plugin has extensive integration with the [relay plugin](https://pothos-graphql.dev/docs/plugins/relay), which makes creating nodes and connections very easy.

### [`prismaNode`](https://pothos-graphql.dev/docs/plugins/prisma/relay#prismanode)

The `prismaNode` method works just like the `prismaObject` method with a couple of small differences:

- there is a new `id` option that mirrors the `id` option from `node` method of the relay plugin, and must contain a resolve function that returns the id from an instance of the node. Rather than defining a resolver for the id field, you can set the `field` option to the name of a unique column or index.

```
builder.prismaNode('Post', {
  // This set's what database field to use for the nodes id field
  id: { field: 'id' },
  // fields work just like they do for builder.prismaObject
  fields: (t) => ({
    title: t.exposeString('title'),
    author: t.relation('author'),
  }),
});
```

If you need to customize how ids are formatted, you can add a resolver for the `id`, and provide a `findUnique` option that can be used to load the node by it's id. This is generally not necessary.

```
builder.prismaNode('Post', {
  id: { resolve: (post) => String(post.id) },
  // The return value will be passed as the `where` of a `prisma.post.findUnique`
  findUnique: (id) => ({ id: Number.parseInt(id, 10) }),
  fields: (t) => ({
    title: t.exposeString('title'),
    author: t.relation('author'),
  }),
});
```

When executing the `node(id: ID!)` query with a global ID for which prisma cannot find a record in the database, the default behavior is to throw an error. There are some scenarios where it is preferable to return `null` instead of throwing an error. For this you can add the `nullable: true` option:

```
builder.prismaNode('Post', {
  id: { resolve: (post) => String(post.id) },
  nullable: true,
  fields: (t) => ({
    title: t.exposeString('title'),
    author: t.relation('author'),
  }),
});
```

---

## URL: https://pothos-graphql.dev/docs/plugins/prisma/connections

Title: Connections

URL Source: https://pothos-graphql.dev/docs/plugins/prisma/connections

Markdown Content:

### [`prismaConnection`](https://pothos-graphql.dev/docs/plugins/prisma/connections#prismaconnection)

The `prismaConnection` method on a field builder can be used to create a relay `connection` field that also pre-loads all the data nested inside that connection.

#### [options](https://pothos-graphql.dev/docs/plugins/prisma/connections#options)

- `type`: the name of the prisma model being connected to
- `cursor`: a `@unique` column of the model being connected to. This is used as the `cursor` option passed to prisma.
- `defaultSize`: (default: 20) The default page size to use if `first` and `last` are not provided.
- `maxSize`: (default: 100) The maximum number of nodes returned for a connection.
- `resolve`: Like the resolver for `prismaField`, the first argument is a `query` object that should be spread into your prisma query. The `resolve` function should return an array of nodes for the connection. The `query` will contain the correct `take`, `skip`, and `cursor` options based on the connection arguments (`before`, `after`, `first`, `last`), along with `include` options for nested selections.
- `totalCount`: A function for loading the total count for the connection. This will add a `totalCount` field to the connection object. The `totalCount` method will receive (`connection`, `args`, `context`, `info`) as arguments. Note that this will not work when using a shared connection object (see details below)

The created connection queries currently support the following combinations of connection arguments:

- `first`, `last`, or `before`
- `first` and `before`
- `last` and `after`

Queries for other combinations are not as useful, and generally requiring loading all records between 2 cursors, or between a cursor and the end of the set. Generating query options for these cases is more complex and likely very inefficient, so they will currently throw an Error indicating the argument combinations are not supported.

The `maxSize` and `defaultSize` can also be configured globally using `maxConnectionSize` and `defaultConnectionSize` options in the `prisma` plugin options.

### [`relatedConnection`](https://pothos-graphql.dev/docs/plugins/prisma/connections#relatedconnection)

The `relatedConnection` method can be used to create a relay `connection` field based on a relation of the current model.

#### [options](https://pothos-graphql.dev/docs/plugins/prisma/connections#options-1)

- `cursor`: a `@unique` column of the model being connected to. This is used as the `cursor` option passed to prisma.
- `defaultSize`: (default: 20) The default page size to use if `first` and `last` are not provided.
- `maxSize`: (default: 100) The maximum number of nodes returned for a connection.
- `query`: A method that accepts the `args` and `context` for the connection field, and returns filtering and sorting logic that will be merged into the query for the relation.
- `totalCount`: when set to true, this will add a `totalCount` field to the connection object. see `relationCount` above for more details. Note that this will not work when using a shared connection object (see details below)

### [Indirect relations as connections](https://pothos-graphql.dev/docs/plugins/prisma/connections#indirect-relations-as-connections)

Creating connections from indirect relations is a little more involved, but can be achieved using `prismaConnectionHelpers` with a normal `t.connection` field.

The above example assumes that you are paginating a relation to a join table, where the pagination args are applied based on the relation to that join table, but the nodes themselves are nested deeper.

`prismaConnectionHelpers` can also be used to manually create a connection where the edge and connections share the same model, and pagination happens directly on a relation to nodes type (even if that relation is nested).

To add arguments for a connection defined with a helper, it is often easiest to define the arguments on the connection field rather than the connection helper. This allows connection helpers to be shared between fields that may not share the same arguments:

Arguments, ordering and filtering can also be defined on the helpers themselves:

### [Sharing Connections objects](https://pothos-graphql.dev/docs/plugins/prisma/connections#sharing-connections-objects)

You can create reusable connection objects by using `builder.connectionObject`.

These connection objects can be used with `t.prismaConnection`, `t.relatedConnection`, or `t.connection`

Shared edges can also be created using `t.edgeObject`

### [Extending connection edges](https://pothos-graphql.dev/docs/plugins/prisma/connections#extending-connection-edges)

In some cases you may want to expose some data from an indirect connection on the edge object.

### [Total count on shared connection objects](https://pothos-graphql.dev/docs/plugins/prisma/connections#total-count-on-shared-connection-objects)

If you are set the `totalCount: true` on a `prismaConnection` or `relatedConnection` field, and are using a custom connection object, you will need to manually add the `totalCount` field to the connection object manually. The parent object on the connection will have a `totalCount` property that is either a the totalCount, or a function that will return the totalCount.

If you want to add a global `totalCount` field, you can do something similar using `builder.globalConnectionField`:

### [`parsePrismaCursor` and `formatPrismaCursor`](https://pothos-graphql.dev/docs/plugins/prisma/connections#parseprismacursor-and-formatprismacursor)

These functions can be used to manually parse and format cursors that are compatible with prisma connections.

Parsing a cursor will return the value from the column used for the cursor (often the `id`), this value may be an array or object when a compound index is used as the cursor. Similarly, to format a cursor, you must provide the column(s) that make up the cursor.

---

## URL: https://pothos-graphql.dev/docs/plugins/prisma/variants

Title: Type variants

URL Source: https://pothos-graphql.dev/docs/plugins/prisma/variants

Markdown Content:
The prisma plugin supports defining multiple GraphQL types based on the same prisma model. Additional types are called `variants`. You will always need to have a "Primary" variant (defined as described above). Additional variants can be defined by providing a `variant` option instead of a `name` option when creating the type:

```
const Viewer = builder.prismaObject('User', {
  variant: 'Viewer',
  fields: (t) => ({
    id: t.exposeID('id'),
  });
});
```

You can define variant fields that reference one variant from another:

```
const Viewer = builder.prismaObject('User', {
  variant: 'Viewer',
  fields: (t) => ({
    id: t.exposeID('id'),
    // Using the model name ('User') will reference the primary variant
    user: t.variant('User'),
  });
});

const User = builder.prismaNode('User', {
  id: {
    resolve: (user) => user.id,
  },
  fields: (t) => ({
    // To reference another variant, use the returned object Ref instead of the model name:
    viewer: t.variant(Viewer, {
      // return null for viewer if the parent User is not the current user
      isNull: (user, args, ctx) => user.id !== ctx.user.id,
    }),
    email: t.exposeString('email'),
  }),
});
```

You can also use variants when defining relations by providing a `type` option:

```
const PostDraft = builder.prismaNode('Post', {
  variant: 'PostDraft'
  // This set's what database field to use for the nodes id field
  id: { field: 'id' },
  // fields work just like they do for builder.prismaObject
  fields: (t) => ({
    title: t.exposeString('title'),
    author: t.relation('author'),
  }),
});

const Viewer = builder.prismaObject('User', {
  variant: 'Viewer',
  fields: (t) => ({
    id: t.exposeID('id'),
    drafts: t.relation('posts', {
      // This will cause this relation to use the PostDraft variant rather than the default Post variant
      type: PostDraft,
      query: { where: { draft: true } },
    }),
  });
});
```

You may run into circular reference issues if you use 2 prisma object refs to reference each other. To avoid this, you can split out the field definition for one of the relationships using `builder.prismaObjectField`

```
const Viewer = builder.prismaObject('User', {
  variant: 'Viewer',
  fields: (t) => ({
    id: t.exposeID('id'),
    user: t.variant(User),
  });
});

const User = builder.prismaNode('User', {
  interfaces: [Named],
  id: {
    resolve: (user) => user.id,
  },
  fields: (t) => ({
    email: t.exposeString('email'),
  }),
});

// Viewer references the `User` ref in its field definition,
// referencing the `User` in fields would cause a circular type issue
builder.prismaObjectField(Viewer, 'user', t.variant(User));
```

This same workaround applies when defining relations using variants.

---

## URL: https://pothos-graphql.dev/docs/plugins/prisma/indirect-relations

Title: Indirect relations

URL Source: https://pothos-graphql.dev/docs/plugins/prisma/indirect-relations

Markdown Content:
Indirect relations

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 1: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Add GraphQL plugin](https://pothos-graphql.dev/docs/plugins/add-graphql)[Complexity plugin](https://pothos-graphql.dev/docs/plugins/complexity)[Dataloader plugin](https://pothos-graphql.dev/docs/plugins/dataloader)[Directive plugin](https://pothos-graphql.dev/docs/plugins/directives)[Drizzle plugin](https://pothos-graphql.dev/docs/plugins/drizzle)[Errors plugin](https://pothos-graphql.dev/docs/plugins/errors)[Federation plugin](https://pothos-graphql.dev/docs/plugins/federation)[Mocks plugin](https://pothos-graphql.dev/docs/plugins/mocks)[Relay plugin](https://pothos-graphql.dev/docs/plugins/relay)[Auth plugin](https://pothos-graphql.dev/docs/plugins/scope-auth)[Simple objects plugin](https://pothos-graphql.dev/docs/plugins/simple-objects)[Smart subscriptions plugin](https://pothos-graphql.dev/docs/plugins/smart-subscriptions)[SubGraph plugin](https://pothos-graphql.dev/docs/plugins/sub-graph)[Tracing plugin](https://pothos-graphql.dev/docs/plugins/tracing)[With-Input plugin](https://pothos-graphql.dev/docs/plugins/with-input)[Zod Validation plugin](https://pothos-graphql.dev/docs/plugins/zod)

[Prisma](https://pothos-graphql.dev/docs/plugins/prisma)

[Setup](https://pothos-graphql.dev/docs/plugins/prisma/setup)[Prisma Objects](https://pothos-graphql.dev/docs/plugins/prisma/objects)[Relations](https://pothos-graphql.dev/docs/plugins/prisma/relations)[Selections](https://pothos-graphql.dev/docs/plugins/prisma/selections)[Relay](https://pothos-graphql.dev/docs/plugins/prisma/relay)[Connections](https://pothos-graphql.dev/docs/plugins/prisma/connections)[Type variants](https://pothos-graphql.dev/docs/plugins/prisma/variants)[Indirect relations](https://pothos-graphql.dev/docs/plugins/prisma/indirect-relations)[Interfaces](https://pothos-graphql.dev/docs/plugins/prisma/interfaces)[Prisma Utils](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils)[Prisma without a plugin](https://pothos-graphql.dev/docs/plugins/prisma/without-a-plugin)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

Indirect relations

[Plugins](https://pothos-graphql.dev/docs/plugins)/[Prisma](https://pothos-graphql.dev/docs/plugins/prisma)

# Indirect relations

## [Selecting fields from a nested GraphQL field](https://pothos-graphql.dev/docs/plugins/prisma/indirect-relations#selecting-fields-from-a-nested-graphql-field)

By default, the `nestedSelection` function will return selections based on the type of the current field. `nestedSelection` can also be used to get a selection from a field nested deeper inside other fields. This is useful if the field returns a type that is not a `prismaObject`, but a field nested inside the returned type is.

```
const PostRef = builder.prismaObject('Post', {
  fields: (t) => ({
    title: t.exposeString('title'),
    content: t.exposeString('content'),
    author: t.relation('author'),
  }),
});

const PostPreview = builder.objectRef<Post>('PostPreview').implement({
  fields: (t) => ({
    post: t.field({
      type: PostRef,
      resolve: (post) => post,
    }),
    preview: t.string({
      nullable: true,
      resolve: (post) => post.content?.slice(10),
    }),
  }),
});

builder.prismaObject('User', {
  fields: (t) => ({
    id: t.exposeID('id'),
    postPreviews: t.field({
      select: (args, ctx, nestedSelection) => ({
        posts: nestedSelection(
          {
            // limit the number of postPreviews to load
            take: 2,
          },
          // Look at the selections in postPreviews.post to determine what relations/fields to select
          ['post'],
          // (optional) If the field returns a union or interface, you can pass a typeName to get selections for a specific object type
          'Post',
        ),
      }),
      type: [PostPreview],
      resolve: (user) => user.posts,
    }),
  }),
});
```

## [Indirect relations (eg. Join tables)](https://pothos-graphql.dev/docs/plugins/prisma/indirect-relations#indirect-relations-eg-join-tables)

If you want to define a GraphQL field that directly exposes data from a nested relationship (many to many relations using a custom join table is a common example of this) you can use the `nestedSelection` function passed to `select`.

Given a prisma schema like the following:

```
model Post {
  id        Int         @id @default(autoincrement())
  title     String
  content   String
  media     PostMedia[]
}

model Media {
  id           Int         @id @default(autoincrement())
  url          String
  posts        PostMedia[]
  uploadedBy   User        @relation(fields: [uploadedById], references: [id])
  uploadedById Int
}

model PostMedia {
  id      Int   @id @default(autoincrement())
  post    Post  @relation(fields: [postId], references: [id])
  media   Media @relation(fields: [mediaId], references: [id])
  postId  Int
  mediaId Int
}
```

You can define a media field that can pre-load the correct relations based on the graphql query:

```
const PostDraft = builder.prismaObject('Post', {
  fields: (t) => ({
    title: t.exposeString('title'),
    media: t.field({
      select: (args, ctx, nestedSelection) => ({
        media: {
          select: {
            // This will look at what fields are queried on Media
            // and automatically select uploadedBy if that relation is requested
            media: nestedSelection(
              // This arument is the default query for the media relation
              // It could be something like: `{ select: { id: true } }` instead
              true,
            ),
          },
        },
      }),
      type: [Media],
      resolve: (post) => post.media.map(({ media }) => media),
    }),
  }),
});

const Media = builder.prismaObject('Media', {
  select: {
    id: true,
  },
  fields: (t) => ({
    url: t.exposeString('url'),
    uploadedBy: t.relation('uploadedBy'),
  }),
});
```

[Type variants How to define multiple GraphQL types based on the same prisma model](https://pothos-graphql.dev/docs/plugins/prisma/variants)[Interfaces Creating interfaces for prisma models that can be shared by variants](https://pothos-graphql.dev/docs/plugins/prisma/interfaces)

### On this page

[Selecting fields from a nested GraphQL field](https://pothos-graphql.dev/docs/plugins/prisma/indirect-relations#selecting-fields-from-a-nested-graphql-field)[Indirect relations (eg. Join tables)](https://pothos-graphql.dev/docs/plugins/prisma/indirect-relations#indirect-relations-eg-join-tables)

---

## URL: https://pothos-graphql.dev/docs/plugins/prisma/interfaces

Title: Interfaces

URL Source: https://pothos-graphql.dev/docs/plugins/prisma/interfaces

Markdown Content:
Interfaces

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 1: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Add GraphQL plugin](https://pothos-graphql.dev/docs/plugins/add-graphql)[Complexity plugin](https://pothos-graphql.dev/docs/plugins/complexity)[Dataloader plugin](https://pothos-graphql.dev/docs/plugins/dataloader)[Directive plugin](https://pothos-graphql.dev/docs/plugins/directives)[Drizzle plugin](https://pothos-graphql.dev/docs/plugins/drizzle)[Errors plugin](https://pothos-graphql.dev/docs/plugins/errors)[Federation plugin](https://pothos-graphql.dev/docs/plugins/federation)[Mocks plugin](https://pothos-graphql.dev/docs/plugins/mocks)[Relay plugin](https://pothos-graphql.dev/docs/plugins/relay)[Auth plugin](https://pothos-graphql.dev/docs/plugins/scope-auth)[Simple objects plugin](https://pothos-graphql.dev/docs/plugins/simple-objects)[Smart subscriptions plugin](https://pothos-graphql.dev/docs/plugins/smart-subscriptions)[SubGraph plugin](https://pothos-graphql.dev/docs/plugins/sub-graph)[Tracing plugin](https://pothos-graphql.dev/docs/plugins/tracing)[With-Input plugin](https://pothos-graphql.dev/docs/plugins/with-input)[Zod Validation plugin](https://pothos-graphql.dev/docs/plugins/zod)

[Prisma](https://pothos-graphql.dev/docs/plugins/prisma)

[Setup](https://pothos-graphql.dev/docs/plugins/prisma/setup)[Prisma Objects](https://pothos-graphql.dev/docs/plugins/prisma/objects)[Relations](https://pothos-graphql.dev/docs/plugins/prisma/relations)[Selections](https://pothos-graphql.dev/docs/plugins/prisma/selections)[Relay](https://pothos-graphql.dev/docs/plugins/prisma/relay)[Connections](https://pothos-graphql.dev/docs/plugins/prisma/connections)[Type variants](https://pothos-graphql.dev/docs/plugins/prisma/variants)[Indirect relations](https://pothos-graphql.dev/docs/plugins/prisma/indirect-relations)[Interfaces](https://pothos-graphql.dev/docs/plugins/prisma/interfaces)[Prisma Utils](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils)[Prisma without a plugin](https://pothos-graphql.dev/docs/plugins/prisma/without-a-plugin)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

[Plugins](https://pothos-graphql.dev/docs/plugins)/[Prisma](https://pothos-graphql.dev/docs/plugins/prisma)

# Interfaces

`builder.prismaInterface` works just like builder.prismaObject and can be used to define either the primary type or a variant for a model.

The following example creates a `User` interface, and 2 variants Admin and Member. The `resolveType` method returns the typenames as strings to avoid issues with circular references.

```
builder.prismaInterface('User', {
  name: 'User',
  fields: (t) => ({
    id: t.exposeID('id'),
    email: t.exposeString('email'),
  }),
  resolveType: (user) => {
    return user.isAdmin ? 'Admin' : 'Member';
  },
});

builder.prismaObject('User', {
  variant: 'Admin',
  interfaces: [User],
  fields: (t) => ({
    isAdmin: t.exposeBoolean('isAdmin'),
  }),
});

builder.prismaObject('User', {
  variant: 'Member',
  interfaces: [User],
  fields: (t) => ({
    bio: t.exposeString('bio'),
  }),
});
```

When using select mode, it's recommended to add selections to both the interface and the object types that implement them. Selections are not inherited and will fallback to the default selection which includes all scalar columns.

You will not be able to extend an interface for a different prisma model, doing so will result in an error at build time.

[Indirect relations Indirect relations and join tables](https://pothos-graphql.dev/docs/plugins/prisma/indirect-relations)[Prisma Utils Prisma utils for creating input types](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils)

---

## URL: https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils

Title: Prisma Utils

URL Source: https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils

Markdown Content:
This package is highly experimental and not recommended for production use

The plugin adds new helpers for creating prisma compatible input types. It is NOT required to use the normal prisma plugin.

To use this plugin, you will need to enable prismaUtils option in the generator in your schema.prisma:

Once this is enabled, you can add the plugin to your schema along with the normal prisma plugin:

Currently this plugin is focused on making it easier to define prisma compatible input types that take advantage of the types defined in your Prisma schema.

The goal is not to generate all input types automatically, but rather to provide building blocks so that writing your own helpers or code-generators becomes a lot easier. There are far too many tradeoffs and choices to be made when designing input types for queries that one solution won't work for everyone.

This plugin will eventually provide more helpers and examples that should allow anyone to quickly set something up to automatically creates all their input types (and eventually other crud operations).

### [Creating filter types for scalars and enums](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils#creating-filter-types-for-scalars-and-enums)

### [Creating filters for Prisma objects (compatible with a "where" clause)](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils#creating-filters-for-prisma-objects-compatible-with-a-where-clause)

### [Creating list filters for scalars](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils#creating-list-filters-for-scalars)

### [Creating list filters for Prisma objects](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils#creating-list-filters-for-prisma-objects)

### [Creating OrderBy input types](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils#creating-orderby-input-types)

### [Inputs for create mutations](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils#inputs-for-create-mutations)

You can use `builder.prismaCreate` to create input types for create mutations.

To get these types to work correctly for circular references, it is recommended to add explicit type annotations, but for simple types that do not have circular references the explicit types can be omitted.

### [Inputs for update mutations](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils#inputs-for-update-mutations)

You can use `builder.prismaUpdate` to Update input types for update mutations.

To get these types to work correctly for circular references, it is recommended to add explicit type annotations, but for simple types that do not have circular references the explicit types can be omitted.

#### [Atomic Int Update operations](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils#atomic-int-update-operations)

Manually defining all the different input types shown above for a large number of tables can become very repetitive. These utilities are designed to be building blocks for generators or utility functions, so that you don't need to hand write these types yourself.

Pothos does not currently ship an official generator for prisma types, but there are a couple of example generators that can be copied and modified to suite your needs. These are intentionally somewhat limited in functionality and not written to be easily exported because they will be updated with breaking changes as these utilities are developed further. They are only intended as building blocks for you to build you own generators.

There are 2 main approaches:

1.  Static Generation: Types are generated and written as a typescript file which can be imported from as part of your schema
2.  Dynamic Generation: Types are generated dynamically at runtime through helpers imported from your App

### [Static generator](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils#static-generator)

You can find an [example static generator here](https://github.com/hayes/pothos/blob/main/packages/plugin-prisma-utils/tests/examples/codegen/generator.ts)

This generator will generate a file with input types for every table in your schema as shown [here](https://github.com/hayes/pothos/blob/main/packages/plugin-prisma-utils/tests/examples/codegen/schema/prisma-inputs.ts)

These generated types can be used in your schema as shown [here](https://github.com/hayes/pothos/blob/main/packages/plugin-prisma-utils/tests/examples/codegen/schema/index.ts)

### [Dynamic generator](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils#dynamic-generator)

You can find an example [dynamic generator here](https://github.com/hayes/pothos/blob/main/packages/plugin-prisma-utils/tests/examples/crud/generator.ts)

This generator exports a class that can be used to dynamically create input types for your builder as shown [here](https://github.com/hayes/pothos/blob/main/packages/plugin-prisma-utils/tests/examples/crud/schema/index.ts#L9-L20)

---

## URL: https://pothos-graphql.dev/docs/plugins/prisma/without-a-plugin

Title: Prisma without a plugin

URL Source: https://pothos-graphql.dev/docs/plugins/prisma/without-a-plugin

Markdown Content:
Prisma without a plugin

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 1: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Add GraphQL plugin](https://pothos-graphql.dev/docs/plugins/add-graphql)[Complexity plugin](https://pothos-graphql.dev/docs/plugins/complexity)[Dataloader plugin](https://pothos-graphql.dev/docs/plugins/dataloader)[Directive plugin](https://pothos-graphql.dev/docs/plugins/directives)[Drizzle plugin](https://pothos-graphql.dev/docs/plugins/drizzle)[Errors plugin](https://pothos-graphql.dev/docs/plugins/errors)[Federation plugin](https://pothos-graphql.dev/docs/plugins/federation)[Mocks plugin](https://pothos-graphql.dev/docs/plugins/mocks)[Relay plugin](https://pothos-graphql.dev/docs/plugins/relay)[Auth plugin](https://pothos-graphql.dev/docs/plugins/scope-auth)[Simple objects plugin](https://pothos-graphql.dev/docs/plugins/simple-objects)[Smart subscriptions plugin](https://pothos-graphql.dev/docs/plugins/smart-subscriptions)[SubGraph plugin](https://pothos-graphql.dev/docs/plugins/sub-graph)[Tracing plugin](https://pothos-graphql.dev/docs/plugins/tracing)[With-Input plugin](https://pothos-graphql.dev/docs/plugins/with-input)[Zod Validation plugin](https://pothos-graphql.dev/docs/plugins/zod)

[Prisma](https://pothos-graphql.dev/docs/plugins/prisma)

[Setup](https://pothos-graphql.dev/docs/plugins/prisma/setup)[Prisma Objects](https://pothos-graphql.dev/docs/plugins/prisma/objects)[Relations](https://pothos-graphql.dev/docs/plugins/prisma/relations)[Selections](https://pothos-graphql.dev/docs/plugins/prisma/selections)[Relay](https://pothos-graphql.dev/docs/plugins/prisma/relay)[Connections](https://pothos-graphql.dev/docs/plugins/prisma/connections)[Type variants](https://pothos-graphql.dev/docs/plugins/prisma/variants)[Indirect relations](https://pothos-graphql.dev/docs/plugins/prisma/indirect-relations)[Interfaces](https://pothos-graphql.dev/docs/plugins/prisma/interfaces)[Prisma Utils](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils)[Prisma without a plugin](https://pothos-graphql.dev/docs/plugins/prisma/without-a-plugin)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

[Plugins](https://pothos-graphql.dev/docs/plugins)/[Prisma](https://pothos-graphql.dev/docs/plugins/prisma)

# Prisma without a plugin

Using prisma without a plugin is relatively straight forward using the `builder.objectRef` method.

The easiest way to create types backed by prisma looks something like:

```
import { Post, PrismaClient, User } from '@prisma/client';

const db = new PrismaClient();
const UserObject = builder.objectRef<User>('User');
const PostObject = builder.objectRef<Post>('Post');

UserObject.implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    email: t.exposeString('email'),
    posts: t.field({
      type: [PostObject],
      resolve: (user) =>
        db.post.findMany({
          where: { authorId: user.id },
        }),
    }),
  }),
});

PostObject.implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    title: t.exposeString('title'),
    author: t.field({
      type: UserObject,
      resolve: (post) => db.user.findUniqueOrThrow({ where: { id: post.authorId } }),
    }),
  }),
});

builder.queryType({
  fields: (t) => ({
    me: t.field({
      type: UserObject,
      resolve: (root, args, ctx) => db.user.findUniqueOrThrow({ where: { id: ctx.userId } }),
    }),
  }),
});
```

This sets up User, and Post objects with a few fields, and a `me` query that returns the current user. There are a few things to note in this setup:

1.  We split up the `builder.objectRef` and the `implement` calls, rather than calling `builder.objectRef(...).implement(...)`. This prevents typescript from getting tripped up by the circular references between posts and users.
2.  We use `findUniqueOrThrow` because those fields are not nullable. Using `findUnique`, prisma will return a null if the object is not found. An alternative is to mark these fields as nullable.
3.  The refs to our object types are called `UserObject` and `PostObject`, this is because `User` and `Post` are the names of the types imported from prisma. We could instead alias the types when we import them so we can name the refs to our GraphQL types after the models.

This setup is fairly simple, but it is easy to see the n+1 issues we might run into. Prisma helps with this by batching queries together, but there are also things we can do in our implementation to improve things.

One thing we could do if we know we will usually be loading the author any time we load a post is to make the author part of shape required for a post:

```
const UserObject = builder.objectRef<User>('User');
// We add the author here in the objectRef
const PostObject = builder.objectRef<Post & { author: User }>('Post');

UserObject.implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    email: t.exposeString('email'),
    posts: t.field({
      type: [PostObject],
      resolve: (user) =>
        db.post.findMany({
          // We now need to include the author when we query for posts
          include: {
            author: true,
          },
          where: { authorId: user.id },
        }),
    }),
  }),
});

PostObject.implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    title: t.exposeString('title'),
    author: t.field({
      type: UserObject,
      // Now we can just return the author from the post instead of querying for it
      resolve: (post) => post.author,
    }),
  }),
});
```

We may not always want to query for the author though, so we could make the author optional and fall back to using a query if it was not provided by the parent resolver:

```
const PostObject = builder.objectRef<Post & { author?: User }>('Post');

PostObject.implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    title: t.exposeString('title'),
    author: t.field({
      type: UserObject,
      resolve: (post) =>
        post.author ?? db.user.findUnique({ rejectOnNotFound: true, where: { id: post.authorId } }),
    }),
  }),
});
```

With this setup, a parent resolver has the option to include the author, but we have a fallback incase it does not.

There are other patterns like data loaders than can be used to reduce n+1 issues, and make your graph more efficient, but they are too complex to describe here.

[Prisma Utils Prisma utils for creating input types](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils)[Migrations List of Pothos migration guides](https://pothos-graphql.dev/docs/migrations)

---

## URL: https://pothos-graphql.dev/docs/plugins/prisma#using-prisma-without-a-plugin

Title: Prisma plugin

URL Source: https://pothos-graphql.dev/docs/plugins/prisma

Markdown Content:
Prisma plugin

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 1: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Add GraphQL plugin](https://pothos-graphql.dev/docs/plugins/add-graphql)[Complexity plugin](https://pothos-graphql.dev/docs/plugins/complexity)[Dataloader plugin](https://pothos-graphql.dev/docs/plugins/dataloader)[Directive plugin](https://pothos-graphql.dev/docs/plugins/directives)[Drizzle plugin](https://pothos-graphql.dev/docs/plugins/drizzle)[Errors plugin](https://pothos-graphql.dev/docs/plugins/errors)[Federation plugin](https://pothos-graphql.dev/docs/plugins/federation)[Mocks plugin](https://pothos-graphql.dev/docs/plugins/mocks)[Relay plugin](https://pothos-graphql.dev/docs/plugins/relay)[Auth plugin](https://pothos-graphql.dev/docs/plugins/scope-auth)[Simple objects plugin](https://pothos-graphql.dev/docs/plugins/simple-objects)[Smart subscriptions plugin](https://pothos-graphql.dev/docs/plugins/smart-subscriptions)[SubGraph plugin](https://pothos-graphql.dev/docs/plugins/sub-graph)[Tracing plugin](https://pothos-graphql.dev/docs/plugins/tracing)[With-Input plugin](https://pothos-graphql.dev/docs/plugins/with-input)[Zod Validation plugin](https://pothos-graphql.dev/docs/plugins/zod)

[Prisma](https://pothos-graphql.dev/docs/plugins/prisma)

[Setup](https://pothos-graphql.dev/docs/plugins/prisma/setup)[Prisma Objects](https://pothos-graphql.dev/docs/plugins/prisma/objects)[Relations](https://pothos-graphql.dev/docs/plugins/prisma/relations)[Selections](https://pothos-graphql.dev/docs/plugins/prisma/selections)[Relay](https://pothos-graphql.dev/docs/plugins/prisma/relay)[Connections](https://pothos-graphql.dev/docs/plugins/prisma/connections)[Type variants](https://pothos-graphql.dev/docs/plugins/prisma/variants)[Indirect relations](https://pothos-graphql.dev/docs/plugins/prisma/indirect-relations)[Interfaces](https://pothos-graphql.dev/docs/plugins/prisma/interfaces)[Prisma Utils](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils)[Prisma without a plugin](https://pothos-graphql.dev/docs/plugins/prisma/without-a-plugin)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

Prisma plugin Features

[Plugins](https://pothos-graphql.dev/docs/plugins)

# Prisma plugin

This plugin provides tighter integration with prisma, making it easier to define prisma based object types, and helps solve n+1 queries for relations. It also has integrations for the relay plugin to make defining nodes and connections easy and efficient.

This plugin is NOT required to use prisma with Pothos, but does make things a lot easier and more efficient. See the [Using Prisma without a plugin](https://pothos-graphql.dev/docs/plugins/prisma#using-prisma-without-a-plugin) section below for more details.

## [Features](https://pothos-graphql.dev/docs/plugins/prisma#features)

- 🎨 Quickly define GraphQL types based on your Prisma models
- 🦺 Strong type-safety throughout the entire API
- 🤝 Automatically resolve relationships defined in your database
- 🎣 Automatic Query optimization to efficiently load the specific data needed to resolve a query (solves common N+1 issues)
- 💅 Types and fields in GraphQL schema are not implicitly tied to the column names or types in your database.
- 🔀 Relay integration for defining nodes and connections that can be efficiently loaded.
- 📚 Supports multiple GraphQL models based on the same Database model
- 🧮 Count fields can easily be added to objects and connections

## [Example](https://pothos-graphql.dev/docs/plugins/prisma#example)

Here is a quick example of what an API using this plugin might look like. There is a more thorough breakdown of what the methods and options used in the example below.

```
// Create an object type based on a prisma model
// without providing any custom type information
builder.prismaObject('User', {
  fields: (t) => ({
    // expose fields from the database
    id: t.exposeID('id'),
    email: t.exposeString('email'),
    bio: t.string({
      // automatically load the bio from the profile
      // when this field is queried
      select: {
        profile: {
          select: {
            bio: true,
          },
        },
      },
      // user will be typed correctly to include the
      // selected fields from above
      resolve: (user) => user.profile.bio,
    }),
    // Load posts as list field.
    posts: t.relation('posts', {
      args: {
        oldestFirst: t.arg.boolean(),
      },
      // Define custom query options that are applied when
      // loading the post relation
      query: (args, context) => ({
        orderBy: {
          createdAt: args.oldestFirst ? 'asc' : 'desc',
        },
      }),
    }),
    // creates relay connection that handles pagination
    // using prisma's built in cursor based pagination
    postsConnection: t.relatedConnection('posts', {
      cursor: 'id',
    }),
  }),
});

// Create a relay node based a prisma model
builder.prismaNode('Post', {
  id: { field: 'id' },
  fields: (t) => ({
    title: t.exposeString('title'),
    author: t.relation('author'),
  }),
});

builder.queryType({
  fields: (t) => ({
    // Define a field that issues an optimized prisma query
    me: t.prismaField({
      type: 'User',
      resolve: async (query, root, args, ctx, info) =>
        prisma.user.findUniqueOrThrow({
          // the `query` argument will add in `include`s or `select`s to
          // resolve as much of the request in a single query as possible
          ...query,
          where: { id: ctx.userId },
        }),
    }),
  }),
});
```

Given this schema, you would be able to resolve a query like the following with a single prisma query (which will still result in a few optimized SQL queries).

```
query {
  me {
    email
    posts {
      title
      author {
        id
      }
    }
  }
}
```

A query like

```
query {
  me {
    email
    posts {
      title
      author {
        id
      }
    }
    oldPosts: posts(oldestFirst: true) {
      title
      author {
        id
      }
    }
  }
}
```

Will result in 2 calls to prisma, one to resolve everything except `oldPosts`, and a second to resolve everything inside `oldPosts`. Prisma can only resolve each relation once in a single query, so we need a separate to handle the second `posts` relation.

[Zod Validation plugin Zod plugin docs for Pothos](https://pothos-graphql.dev/docs/plugins/zod)[Setup Setting up the Prisma plugin](https://pothos-graphql.dev/docs/plugins/prisma/setup)

### On this page

[Features](https://pothos-graphql.dev/docs/plugins/prisma#features)[Example](https://pothos-graphql.dev/docs/plugins/prisma#example)

---

## URL: https://pothos-graphql.dev/docs/plugins/prisma#features

Title: Prisma plugin

URL Source: https://pothos-graphql.dev/docs/plugins/prisma

Markdown Content:
Prisma plugin

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 1: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Add GraphQL plugin](https://pothos-graphql.dev/docs/plugins/add-graphql)[Complexity plugin](https://pothos-graphql.dev/docs/plugins/complexity)[Dataloader plugin](https://pothos-graphql.dev/docs/plugins/dataloader)[Directive plugin](https://pothos-graphql.dev/docs/plugins/directives)[Drizzle plugin](https://pothos-graphql.dev/docs/plugins/drizzle)[Errors plugin](https://pothos-graphql.dev/docs/plugins/errors)[Federation plugin](https://pothos-graphql.dev/docs/plugins/federation)[Mocks plugin](https://pothos-graphql.dev/docs/plugins/mocks)[Relay plugin](https://pothos-graphql.dev/docs/plugins/relay)[Auth plugin](https://pothos-graphql.dev/docs/plugins/scope-auth)[Simple objects plugin](https://pothos-graphql.dev/docs/plugins/simple-objects)[Smart subscriptions plugin](https://pothos-graphql.dev/docs/plugins/smart-subscriptions)[SubGraph plugin](https://pothos-graphql.dev/docs/plugins/sub-graph)[Tracing plugin](https://pothos-graphql.dev/docs/plugins/tracing)[With-Input plugin](https://pothos-graphql.dev/docs/plugins/with-input)[Zod Validation plugin](https://pothos-graphql.dev/docs/plugins/zod)

[Prisma](https://pothos-graphql.dev/docs/plugins/prisma)

[Setup](https://pothos-graphql.dev/docs/plugins/prisma/setup)[Prisma Objects](https://pothos-graphql.dev/docs/plugins/prisma/objects)[Relations](https://pothos-graphql.dev/docs/plugins/prisma/relations)[Selections](https://pothos-graphql.dev/docs/plugins/prisma/selections)[Relay](https://pothos-graphql.dev/docs/plugins/prisma/relay)[Connections](https://pothos-graphql.dev/docs/plugins/prisma/connections)[Type variants](https://pothos-graphql.dev/docs/plugins/prisma/variants)[Indirect relations](https://pothos-graphql.dev/docs/plugins/prisma/indirect-relations)[Interfaces](https://pothos-graphql.dev/docs/plugins/prisma/interfaces)[Prisma Utils](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils)[Prisma without a plugin](https://pothos-graphql.dev/docs/plugins/prisma/without-a-plugin)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

Prisma plugin Features

[Plugins](https://pothos-graphql.dev/docs/plugins)

# Prisma plugin

This plugin provides tighter integration with prisma, making it easier to define prisma based object types, and helps solve n+1 queries for relations. It also has integrations for the relay plugin to make defining nodes and connections easy and efficient.

This plugin is NOT required to use prisma with Pothos, but does make things a lot easier and more efficient. See the [Using Prisma without a plugin](https://pothos-graphql.dev/docs/plugins/prisma#using-prisma-without-a-plugin) section below for more details.

## [Features](https://pothos-graphql.dev/docs/plugins/prisma#features)

- 🎨 Quickly define GraphQL types based on your Prisma models
- 🦺 Strong type-safety throughout the entire API
- 🤝 Automatically resolve relationships defined in your database
- 🎣 Automatic Query optimization to efficiently load the specific data needed to resolve a query (solves common N+1 issues)
- 💅 Types and fields in GraphQL schema are not implicitly tied to the column names or types in your database.
- 🔀 Relay integration for defining nodes and connections that can be efficiently loaded.
- 📚 Supports multiple GraphQL models based on the same Database model
- 🧮 Count fields can easily be added to objects and connections

## [Example](https://pothos-graphql.dev/docs/plugins/prisma#example)

Here is a quick example of what an API using this plugin might look like. There is a more thorough breakdown of what the methods and options used in the example below.

```
// Create an object type based on a prisma model
// without providing any custom type information
builder.prismaObject('User', {
  fields: (t) => ({
    // expose fields from the database
    id: t.exposeID('id'),
    email: t.exposeString('email'),
    bio: t.string({
      // automatically load the bio from the profile
      // when this field is queried
      select: {
        profile: {
          select: {
            bio: true,
          },
        },
      },
      // user will be typed correctly to include the
      // selected fields from above
      resolve: (user) => user.profile.bio,
    }),
    // Load posts as list field.
    posts: t.relation('posts', {
      args: {
        oldestFirst: t.arg.boolean(),
      },
      // Define custom query options that are applied when
      // loading the post relation
      query: (args, context) => ({
        orderBy: {
          createdAt: args.oldestFirst ? 'asc' : 'desc',
        },
      }),
    }),
    // creates relay connection that handles pagination
    // using prisma's built in cursor based pagination
    postsConnection: t.relatedConnection('posts', {
      cursor: 'id',
    }),
  }),
});

// Create a relay node based a prisma model
builder.prismaNode('Post', {
  id: { field: 'id' },
  fields: (t) => ({
    title: t.exposeString('title'),
    author: t.relation('author'),
  }),
});

builder.queryType({
  fields: (t) => ({
    // Define a field that issues an optimized prisma query
    me: t.prismaField({
      type: 'User',
      resolve: async (query, root, args, ctx, info) =>
        prisma.user.findUniqueOrThrow({
          // the `query` argument will add in `include`s or `select`s to
          // resolve as much of the request in a single query as possible
          ...query,
          where: { id: ctx.userId },
        }),
    }),
  }),
});
```

Given this schema, you would be able to resolve a query like the following with a single prisma query (which will still result in a few optimized SQL queries).

```
query {
  me {
    email
    posts {
      title
      author {
        id
      }
    }
  }
}
```

A query like

```
query {
  me {
    email
    posts {
      title
      author {
        id
      }
    }
    oldPosts: posts(oldestFirst: true) {
      title
      author {
        id
      }
    }
  }
}
```

Will result in 2 calls to prisma, one to resolve everything except `oldPosts`, and a second to resolve everything inside `oldPosts`. Prisma can only resolve each relation once in a single query, so we need a separate to handle the second `posts` relation.

[Zod Validation plugin Zod plugin docs for Pothos](https://pothos-graphql.dev/docs/plugins/zod)[Setup Setting up the Prisma plugin](https://pothos-graphql.dev/docs/plugins/prisma/setup)

### On this page

[Features](https://pothos-graphql.dev/docs/plugins/prisma#features)[Example](https://pothos-graphql.dev/docs/plugins/prisma#example)

---

## URL: https://pothos-graphql.dev/docs/plugins/prisma#example

Title: Prisma plugin

URL Source: https://pothos-graphql.dev/docs/plugins/prisma

Markdown Content:
Prisma plugin

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 1: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Add GraphQL plugin](https://pothos-graphql.dev/docs/plugins/add-graphql)[Complexity plugin](https://pothos-graphql.dev/docs/plugins/complexity)[Dataloader plugin](https://pothos-graphql.dev/docs/plugins/dataloader)[Directive plugin](https://pothos-graphql.dev/docs/plugins/directives)[Drizzle plugin](https://pothos-graphql.dev/docs/plugins/drizzle)[Errors plugin](https://pothos-graphql.dev/docs/plugins/errors)[Federation plugin](https://pothos-graphql.dev/docs/plugins/federation)[Mocks plugin](https://pothos-graphql.dev/docs/plugins/mocks)[Relay plugin](https://pothos-graphql.dev/docs/plugins/relay)[Auth plugin](https://pothos-graphql.dev/docs/plugins/scope-auth)[Simple objects plugin](https://pothos-graphql.dev/docs/plugins/simple-objects)[Smart subscriptions plugin](https://pothos-graphql.dev/docs/plugins/smart-subscriptions)[SubGraph plugin](https://pothos-graphql.dev/docs/plugins/sub-graph)[Tracing plugin](https://pothos-graphql.dev/docs/plugins/tracing)[With-Input plugin](https://pothos-graphql.dev/docs/plugins/with-input)[Zod Validation plugin](https://pothos-graphql.dev/docs/plugins/zod)

[Prisma](https://pothos-graphql.dev/docs/plugins/prisma)

[Setup](https://pothos-graphql.dev/docs/plugins/prisma/setup)[Prisma Objects](https://pothos-graphql.dev/docs/plugins/prisma/objects)[Relations](https://pothos-graphql.dev/docs/plugins/prisma/relations)[Selections](https://pothos-graphql.dev/docs/plugins/prisma/selections)[Relay](https://pothos-graphql.dev/docs/plugins/prisma/relay)[Connections](https://pothos-graphql.dev/docs/plugins/prisma/connections)[Type variants](https://pothos-graphql.dev/docs/plugins/prisma/variants)[Indirect relations](https://pothos-graphql.dev/docs/plugins/prisma/indirect-relations)[Interfaces](https://pothos-graphql.dev/docs/plugins/prisma/interfaces)[Prisma Utils](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils)[Prisma without a plugin](https://pothos-graphql.dev/docs/plugins/prisma/without-a-plugin)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

Prisma plugin Features

[Plugins](https://pothos-graphql.dev/docs/plugins)

# Prisma plugin

This plugin provides tighter integration with prisma, making it easier to define prisma based object types, and helps solve n+1 queries for relations. It also has integrations for the relay plugin to make defining nodes and connections easy and efficient.

This plugin is NOT required to use prisma with Pothos, but does make things a lot easier and more efficient. See the [Using Prisma without a plugin](https://pothos-graphql.dev/docs/plugins/prisma#using-prisma-without-a-plugin) section below for more details.

## [Features](https://pothos-graphql.dev/docs/plugins/prisma#features)

- 🎨 Quickly define GraphQL types based on your Prisma models
- 🦺 Strong type-safety throughout the entire API
- 🤝 Automatically resolve relationships defined in your database
- 🎣 Automatic Query optimization to efficiently load the specific data needed to resolve a query (solves common N+1 issues)
- 💅 Types and fields in GraphQL schema are not implicitly tied to the column names or types in your database.
- 🔀 Relay integration for defining nodes and connections that can be efficiently loaded.
- 📚 Supports multiple GraphQL models based on the same Database model
- 🧮 Count fields can easily be added to objects and connections

## [Example](https://pothos-graphql.dev/docs/plugins/prisma#example)

Here is a quick example of what an API using this plugin might look like. There is a more thorough breakdown of what the methods and options used in the example below.

```
// Create an object type based on a prisma model
// without providing any custom type information
builder.prismaObject('User', {
  fields: (t) => ({
    // expose fields from the database
    id: t.exposeID('id'),
    email: t.exposeString('email'),
    bio: t.string({
      // automatically load the bio from the profile
      // when this field is queried
      select: {
        profile: {
          select: {
            bio: true,
          },
        },
      },
      // user will be typed correctly to include the
      // selected fields from above
      resolve: (user) => user.profile.bio,
    }),
    // Load posts as list field.
    posts: t.relation('posts', {
      args: {
        oldestFirst: t.arg.boolean(),
      },
      // Define custom query options that are applied when
      // loading the post relation
      query: (args, context) => ({
        orderBy: {
          createdAt: args.oldestFirst ? 'asc' : 'desc',
        },
      }),
    }),
    // creates relay connection that handles pagination
    // using prisma's built in cursor based pagination
    postsConnection: t.relatedConnection('posts', {
      cursor: 'id',
    }),
  }),
});

// Create a relay node based a prisma model
builder.prismaNode('Post', {
  id: { field: 'id' },
  fields: (t) => ({
    title: t.exposeString('title'),
    author: t.relation('author'),
  }),
});

builder.queryType({
  fields: (t) => ({
    // Define a field that issues an optimized prisma query
    me: t.prismaField({
      type: 'User',
      resolve: async (query, root, args, ctx, info) =>
        prisma.user.findUniqueOrThrow({
          // the `query` argument will add in `include`s or `select`s to
          // resolve as much of the request in a single query as possible
          ...query,
          where: { id: ctx.userId },
        }),
    }),
  }),
});
```

Given this schema, you would be able to resolve a query like the following with a single prisma query (which will still result in a few optimized SQL queries).

```
query {
  me {
    email
    posts {
      title
      author {
        id
      }
    }
  }
}
```

A query like

```
query {
  me {
    email
    posts {
      title
      author {
        id
      }
    }
    oldPosts: posts(oldestFirst: true) {
      title
      author {
        id
      }
    }
  }
}
```

Will result in 2 calls to prisma, one to resolve everything except `oldPosts`, and a second to resolve everything inside `oldPosts`. Prisma can only resolve each relation once in a single query, so we need a separate to handle the second `posts` relation.

[Zod Validation plugin Zod plugin docs for Pothos](https://pothos-graphql.dev/docs/plugins/zod)[Setup Setting up the Prisma plugin](https://pothos-graphql.dev/docs/plugins/prisma/setup)

### On this page

[Features](https://pothos-graphql.dev/docs/plugins/prisma#features)[Example](https://pothos-graphql.dev/docs/plugins/prisma#example)

---

## URL: https://pothos-graphql.dev/docs/plugins/relay#expose-nodes

Title: Relay plugin

URL Source: https://pothos-graphql.dev/docs/plugins/relay

Markdown Content:
The Relay plugin adds a number of builder methods and helper functions to simplify building a relay compatible schema.

### [Install](https://pothos-graphql.dev/docs/plugins/relay#install)

### [Setup](https://pothos-graphql.dev/docs/plugins/relay#setup)

### [Options](https://pothos-graphql.dev/docs/plugins/relay#options)

The `relay` options object passed to builder can contain the following properties:

- `idFieldName`: The name of the field that contains the global id for the node. Defaults to `id`.
- `idFieldOptions`: Options to pass to the id field.
- `clientMutationId`: `omit` (default) | `required` | `optional`. Determines if clientMutationId fields are created on `relayMutationFields`, and if they are required.
- `cursorType`: `String` | `ID`. Determines type used for cursor fields. Defaults to `String`
- `nodeQueryOptions`: Options for the `node` field on the query object, set to false to omit the field
- `nodesQueryOptions`: Options for the `nodes` field on the query object, set to false to omit the field
- `nodeTypeOptions`: Options for the `Node` interface type
- `pageInfoTypeOptions`: Options for the `TypeInfo` object type
- `clientMutationIdFieldOptions`: Options for the `clientMutationId` field on connection objects
- `clientMutationIdInputOptions`: Options for the `clientMutationId` input field on connections fields
- `mutationInputArgOptions`: Options for the Input object created for each connection field
- `cursorFieldOptions`: Options for the `cursor` field on an edge object.
- `nodeFieldOptions`: Options for the `node` field on an edge object.
- `edgesFieldOptions`: Options for the `edges` field on a connection object.
- `pageInfoFieldOptions`: Options for the `pageInfo` field on a connection object.
- `hasNextPageFieldOptions`: Options for the `hasNextPage` field on the `PageInfo` object.
- `hasPreviousPageFieldOptions`: Options for the `hasPreviousPage` field on the `PageInfo` object.
- `startCursorFieldOptions`: Options for the `startCursor` field on the `PageInfo` object.
- `endCursorFieldOptions`: Options for the `endCursor` field on the `PageInfo` object.
- `beforeArgOptions`: Options for the `before` arg on a connection field.
- `afterArgOptions`: Options for the `after` arg on a connection field.
- `firstArgOptions`: Options for the `first` arg on a connection field.
- `lastArgOptions`: Options for the `last` arg on a connection field.
- `defaultConnectionTypeOptions`: Default options for the `Connection` Object types.
- `defaultEdgeTypeOptions`: Default options for the `Edge` Object types.
- `defaultPayloadTypeOptions`: Default options for the `Payload` Object types.
- `defaultMutationInputTypeOptions`: default options for the mutation `Input` types.
- `nodesOnConnection`: If true, the `nodes` field will be added to the `Connection` object types.
- `defaultConnectionFieldOptions`: Default options for connection fields defined with t.connection
- `brandLoadedObjects`: Defaults to `true`. This will add a hidden symbol to objects returned from the `load` methods of Nodes that allows the default `resolveType` implementation to identify the type of the node. When this is enabled, you will not need to implement an `isTypeOf` check for most common patterns.

### [Creating Nodes](https://pothos-graphql.dev/docs/plugins/relay#creating-nodes)

To create objects that extend the `Node` interface, you can use the new `builder.node` method.

`builder.node` will create an object type that implements the `Node` interface. It will also create the `Node` interface the first time it is used. The `resolve` function for `id` should return a number or string, which will be converted to a globalID. The relay plugin adds to new query fields `node` and `nodes` which can be used to directly fetch nodes using global IDs by calling the provided `loadOne` or `loadMany` method. Each node will only be loaded once by id, and cached if the same node is loaded multiple times inn the same request. You can provide `loadWithoutCache` or `loadManyWithoutCache` instead if caching is not desired, or you are already using a caching datasource like a dataloader.

Nodes may also implement an `isTypeOf` method which can be used to resolve the correct type for lists of generic nodes. When using a class as the type parameter, the `isTypeOf` method defaults to using an `instanceof` check, and falls back to checking the constructor property on the prototype. The means that for many cases if you are using classes in your type parameters, and all your values are instances of those classes, you won't need to implement an `isTypeOf` method, but it is usually better to explicitly define that behavior.

By default (unless `brandLoadedObjects` is set to `false`) any nodes loaded through one of the `load*` methods will be branded so that the default `resolveType` method can identify the GraphQL type for the loaded object. This means `isTypeOf` is only required for `union` and `interface` fields that return node objects that are manually loaded, where the union or interface does not have a custom `resolveType` method that knows how to resolve the node type.

#### [parsing node ids](https://pothos-graphql.dev/docs/plugins/relay#parsing-node-ids)

By default all node ids are parsed as string. This behavior can be customized by providing a custom parse function for your node's ID field:

### [Global IDs](https://pothos-graphql.dev/docs/plugins/relay#global-ids)

To make it easier to create globally unique ids the relay plugin adds new methods for creating globalID fields.

The returned IDs can either be a string (which is expected to already be a globalID), or an object with the an `id` and a `type`, The type can be either the name of a name as a string, or any object that can be used in a type parameter.

There are also new methods for adding globalIDs in arguments or fields of input types:

globalIDs used in arguments expect the client to send a globalID string, but will automatically be converted to an object with 2 properties (`id` and `typename`) before they are passed to your resolver in the arguments object.

#### [Limiting global ID args to specific types](https://pothos-graphql.dev/docs/plugins/relay#limiting-global-id-args-to-specific-types)

`globalID` input's can be configured to validate the type of the globalID. This is useful if you only want to accept IDs for specific node types.

### [Creating Connections](https://pothos-graphql.dev/docs/plugins/relay#creating-connections)

The `t.connection` field builder method can be used to define connections. This method will automatically create the `Connection` and `Edge` objects used by the connection, and add `before`, `after`, `first`, and `last` arguments. The first time this method is used, it will also create the `PageInfo` type.

Manually implementing connections can be cumbersome, so there are a couple of helper methods that can make resolving connections a little easier.

For limit/offset based apis:

`resolveOffsetConnection` has a few default limits to prevent unintentionally allowing too many records to be fetched at once. These limits can be configure using the following options:

For APIs where you have the full array available you can use `resolveArrayConnection`, which works just like `resolveOffsetConnection` and accepts the same options.

Cursor based pagination can be implemented using the `resolveCursorConnection` method. The following example uses prisma, but a similar solution should work with any data store that supports limits, ordering, and filtering.

### [Relay Mutations](https://pothos-graphql.dev/docs/plugins/relay#relay-mutations)

You can use the `relayMutationField` method to define relay compliant mutation fields. This method will generate a mutation field, an input object with a `clientMutationId` field, and an output object with the corresponding `clientMutationId`.

Example ussage:

Which produces the following graphql types:

The `relayMutationField` has 4 arguments:

- `name`: Name of the mutation field
- `inputOptions`: Options for the `input` object or a ref to an existing input object
- `fieldOptions`: Options for the mutation field
- `payloadOptions`: Options for the Payload object

The `inputOptions` has a couple of non-standard options:

- `name` which can be used to set the name of the input object
- `argName` which can be used to overwrite the default arguments name (`input`).

The `payloadOptions` object also accepts a `name` property for setting the name of the payload object.

You can also access refs for the created input and payload objects so you can re-use them in other fields:

### [Reusing connection objects](https://pothos-graphql.dev/docs/plugins/relay#reusing-connection-objects)

In some cases you may want to create a connection object type that is shared by multiple fields. To do this, you will need to create the connection object separately and then create a fields using a ref to your connection object:

`builder.connectionObject` creates the connect object type and the associated Edge type. `t.arg.connectionArgs()` will create the default connection args.

### [Reusing edge objects](https://pothos-graphql.dev/docs/plugins/relay#reusing-edge-objects)

Similarly you can directly create and re-use edge objects

`builder.connectionObject` creates the connect object type and the associated Edge type. `t.arg.connectionArgs()` will create the default connection args.

### [Expose nodes](https://pothos-graphql.dev/docs/plugins/relay#expose-nodes)

The `t.node` and `t.nodes` methods can be used to add additional node fields. the expected return values of `id` and `ids` fields is the same as the resolve value of `t.globalID`, and can either be a globalID or an object with and an `id` and a `type`.

Loading nodes by `id` uses a request cache, so the same node will only be loaded once per request, even if it is used multiple times across the schema.

### [decoding and encoding global ids](https://pothos-graphql.dev/docs/plugins/relay#decoding-and-encoding-global-ids)

The relay plugin exports `decodeGlobalID` and `encodeGlobalID` as helper methods for interacting with global IDs directly. If you accept a global ID as an argument you can use the `decodeGlobalID` function to decode it:

### [Using custom encoding for global ids](https://pothos-graphql.dev/docs/plugins/relay#using-custom-encoding-for-global-ids)

In some cases you may want to encode global ids differently than the build in ID encoding. To do this, you can pass a custom encoding and decoding function into the relay options of the builder:

### [Using custom resolve for node and or nodes field](https://pothos-graphql.dev/docs/plugins/relay#using-custom-resolve-for-node-and-or-nodes-field)

If you need to customize how nodes are loaded for the `node` and or `nodes` fields you can provide custom resolve functions in the builder options for these fields:

### [Extending all connections](https://pothos-graphql.dev/docs/plugins/relay#extending-all-connections)

There are 2 builder methods for adding fields to all connection objects: `t.globalConnectionField` and `t.globalConnectionFields`. These methods work like many of the other methods on the builder for adding fields to objects or interfaces.

In the above example, we are just returning a static number for our `totalCount` field. To make this more useful, we need to have our resolvers for each connection actually return an object that contains a totalCount for us. To guarantee that resolvers correctly implement this behavior, we can define custom properties that must be returned from connection resolvers when we set up our builder:

Now typescript will ensure that objects returned from each connection resolver include a totalCount property, which we can use in our connection fields:

Note that adding additional required properties will make it harder to use the provided connection helpers since they will not automatically return your custom properties. You will need to manually add in any custom props after getting the result from the helpers:

### [Changing nullability of edges and nodes](https://pothos-graphql.dev/docs/plugins/relay#changing-nullability-of-edges-and-nodes)

If you want to change the nullability of the `edges` field on a `Connection` or the `node` field on an `Edge` you can configure this in 2 ways:

#### [Globally](https://pothos-graphql.dev/docs/plugins/relay#globally)

The types provided for `DefaultEdgesNullability` and `DefaultNodeNullability` must match the values provided in the nullable option of `edgesFieldOptions` and `nodeFieldOptions` respectively. This will set the default nullability for all connections created by your builder.

nullability for `edges` fields defaults to `{ list: options.defaultFieldNullability, items: true }` and the nullability of `node` fields is the same as `options.defaultFieldNullability` (which defaults to `true`).

#### [Per connection](https://pothos-graphql.dev/docs/plugins/relay#per-connection)

### [Extending the `Node` interface](https://pothos-graphql.dev/docs/plugins/relay#extending-the-node-interface)

Use the `nodeInterfaceRef` method of your Builder.

For example, to add a new derived field on the interface:

---

## URL: https://pothos-graphql.dev/docs/plugins/relay#changing-nullability-of-edges-and-nodes

Title: Relay plugin

URL Source: https://pothos-graphql.dev/docs/plugins/relay

Markdown Content:
The Relay plugin adds a number of builder methods and helper functions to simplify building a relay compatible schema.

### [Install](https://pothos-graphql.dev/docs/plugins/relay#install)

### [Setup](https://pothos-graphql.dev/docs/plugins/relay#setup)

### [Options](https://pothos-graphql.dev/docs/plugins/relay#options)

The `relay` options object passed to builder can contain the following properties:

- `idFieldName`: The name of the field that contains the global id for the node. Defaults to `id`.
- `idFieldOptions`: Options to pass to the id field.
- `clientMutationId`: `omit` (default) | `required` | `optional`. Determines if clientMutationId fields are created on `relayMutationFields`, and if they are required.
- `cursorType`: `String` | `ID`. Determines type used for cursor fields. Defaults to `String`
- `nodeQueryOptions`: Options for the `node` field on the query object, set to false to omit the field
- `nodesQueryOptions`: Options for the `nodes` field on the query object, set to false to omit the field
- `nodeTypeOptions`: Options for the `Node` interface type
- `pageInfoTypeOptions`: Options for the `TypeInfo` object type
- `clientMutationIdFieldOptions`: Options for the `clientMutationId` field on connection objects
- `clientMutationIdInputOptions`: Options for the `clientMutationId` input field on connections fields
- `mutationInputArgOptions`: Options for the Input object created for each connection field
- `cursorFieldOptions`: Options for the `cursor` field on an edge object.
- `nodeFieldOptions`: Options for the `node` field on an edge object.
- `edgesFieldOptions`: Options for the `edges` field on a connection object.
- `pageInfoFieldOptions`: Options for the `pageInfo` field on a connection object.
- `hasNextPageFieldOptions`: Options for the `hasNextPage` field on the `PageInfo` object.
- `hasPreviousPageFieldOptions`: Options for the `hasPreviousPage` field on the `PageInfo` object.
- `startCursorFieldOptions`: Options for the `startCursor` field on the `PageInfo` object.
- `endCursorFieldOptions`: Options for the `endCursor` field on the `PageInfo` object.
- `beforeArgOptions`: Options for the `before` arg on a connection field.
- `afterArgOptions`: Options for the `after` arg on a connection field.
- `firstArgOptions`: Options for the `first` arg on a connection field.
- `lastArgOptions`: Options for the `last` arg on a connection field.
- `defaultConnectionTypeOptions`: Default options for the `Connection` Object types.
- `defaultEdgeTypeOptions`: Default options for the `Edge` Object types.
- `defaultPayloadTypeOptions`: Default options for the `Payload` Object types.
- `defaultMutationInputTypeOptions`: default options for the mutation `Input` types.
- `nodesOnConnection`: If true, the `nodes` field will be added to the `Connection` object types.
- `defaultConnectionFieldOptions`: Default options for connection fields defined with t.connection
- `brandLoadedObjects`: Defaults to `true`. This will add a hidden symbol to objects returned from the `load` methods of Nodes that allows the default `resolveType` implementation to identify the type of the node. When this is enabled, you will not need to implement an `isTypeOf` check for most common patterns.

### [Creating Nodes](https://pothos-graphql.dev/docs/plugins/relay#creating-nodes)

To create objects that extend the `Node` interface, you can use the new `builder.node` method.

`builder.node` will create an object type that implements the `Node` interface. It will also create the `Node` interface the first time it is used. The `resolve` function for `id` should return a number or string, which will be converted to a globalID. The relay plugin adds to new query fields `node` and `nodes` which can be used to directly fetch nodes using global IDs by calling the provided `loadOne` or `loadMany` method. Each node will only be loaded once by id, and cached if the same node is loaded multiple times inn the same request. You can provide `loadWithoutCache` or `loadManyWithoutCache` instead if caching is not desired, or you are already using a caching datasource like a dataloader.

Nodes may also implement an `isTypeOf` method which can be used to resolve the correct type for lists of generic nodes. When using a class as the type parameter, the `isTypeOf` method defaults to using an `instanceof` check, and falls back to checking the constructor property on the prototype. The means that for many cases if you are using classes in your type parameters, and all your values are instances of those classes, you won't need to implement an `isTypeOf` method, but it is usually better to explicitly define that behavior.

By default (unless `brandLoadedObjects` is set to `false`) any nodes loaded through one of the `load*` methods will be branded so that the default `resolveType` method can identify the GraphQL type for the loaded object. This means `isTypeOf` is only required for `union` and `interface` fields that return node objects that are manually loaded, where the union or interface does not have a custom `resolveType` method that knows how to resolve the node type.

#### [parsing node ids](https://pothos-graphql.dev/docs/plugins/relay#parsing-node-ids)

By default all node ids are parsed as string. This behavior can be customized by providing a custom parse function for your node's ID field:

### [Global IDs](https://pothos-graphql.dev/docs/plugins/relay#global-ids)

To make it easier to create globally unique ids the relay plugin adds new methods for creating globalID fields.

The returned IDs can either be a string (which is expected to already be a globalID), or an object with the an `id` and a `type`, The type can be either the name of a name as a string, or any object that can be used in a type parameter.

There are also new methods for adding globalIDs in arguments or fields of input types:

globalIDs used in arguments expect the client to send a globalID string, but will automatically be converted to an object with 2 properties (`id` and `typename`) before they are passed to your resolver in the arguments object.

#### [Limiting global ID args to specific types](https://pothos-graphql.dev/docs/plugins/relay#limiting-global-id-args-to-specific-types)

`globalID` input's can be configured to validate the type of the globalID. This is useful if you only want to accept IDs for specific node types.

### [Creating Connections](https://pothos-graphql.dev/docs/plugins/relay#creating-connections)

The `t.connection` field builder method can be used to define connections. This method will automatically create the `Connection` and `Edge` objects used by the connection, and add `before`, `after`, `first`, and `last` arguments. The first time this method is used, it will also create the `PageInfo` type.

Manually implementing connections can be cumbersome, so there are a couple of helper methods that can make resolving connections a little easier.

For limit/offset based apis:

`resolveOffsetConnection` has a few default limits to prevent unintentionally allowing too many records to be fetched at once. These limits can be configure using the following options:

For APIs where you have the full array available you can use `resolveArrayConnection`, which works just like `resolveOffsetConnection` and accepts the same options.

Cursor based pagination can be implemented using the `resolveCursorConnection` method. The following example uses prisma, but a similar solution should work with any data store that supports limits, ordering, and filtering.

### [Relay Mutations](https://pothos-graphql.dev/docs/plugins/relay#relay-mutations)

You can use the `relayMutationField` method to define relay compliant mutation fields. This method will generate a mutation field, an input object with a `clientMutationId` field, and an output object with the corresponding `clientMutationId`.

Example ussage:

Which produces the following graphql types:

The `relayMutationField` has 4 arguments:

- `name`: Name of the mutation field
- `inputOptions`: Options for the `input` object or a ref to an existing input object
- `fieldOptions`: Options for the mutation field
- `payloadOptions`: Options for the Payload object

The `inputOptions` has a couple of non-standard options:

- `name` which can be used to set the name of the input object
- `argName` which can be used to overwrite the default arguments name (`input`).

The `payloadOptions` object also accepts a `name` property for setting the name of the payload object.

You can also access refs for the created input and payload objects so you can re-use them in other fields:

### [Reusing connection objects](https://pothos-graphql.dev/docs/plugins/relay#reusing-connection-objects)

In some cases you may want to create a connection object type that is shared by multiple fields. To do this, you will need to create the connection object separately and then create a fields using a ref to your connection object:

`builder.connectionObject` creates the connect object type and the associated Edge type. `t.arg.connectionArgs()` will create the default connection args.

### [Reusing edge objects](https://pothos-graphql.dev/docs/plugins/relay#reusing-edge-objects)

Similarly you can directly create and re-use edge objects

`builder.connectionObject` creates the connect object type and the associated Edge type. `t.arg.connectionArgs()` will create the default connection args.

### [Expose nodes](https://pothos-graphql.dev/docs/plugins/relay#expose-nodes)

The `t.node` and `t.nodes` methods can be used to add additional node fields. the expected return values of `id` and `ids` fields is the same as the resolve value of `t.globalID`, and can either be a globalID or an object with and an `id` and a `type`.

Loading nodes by `id` uses a request cache, so the same node will only be loaded once per request, even if it is used multiple times across the schema.

### [decoding and encoding global ids](https://pothos-graphql.dev/docs/plugins/relay#decoding-and-encoding-global-ids)

The relay plugin exports `decodeGlobalID` and `encodeGlobalID` as helper methods for interacting with global IDs directly. If you accept a global ID as an argument you can use the `decodeGlobalID` function to decode it:

### [Using custom encoding for global ids](https://pothos-graphql.dev/docs/plugins/relay#using-custom-encoding-for-global-ids)

In some cases you may want to encode global ids differently than the build in ID encoding. To do this, you can pass a custom encoding and decoding function into the relay options of the builder:

### [Using custom resolve for node and or nodes field](https://pothos-graphql.dev/docs/plugins/relay#using-custom-resolve-for-node-and-or-nodes-field)

If you need to customize how nodes are loaded for the `node` and or `nodes` fields you can provide custom resolve functions in the builder options for these fields:

### [Extending all connections](https://pothos-graphql.dev/docs/plugins/relay#extending-all-connections)

There are 2 builder methods for adding fields to all connection objects: `t.globalConnectionField` and `t.globalConnectionFields`. These methods work like many of the other methods on the builder for adding fields to objects or interfaces.

In the above example, we are just returning a static number for our `totalCount` field. To make this more useful, we need to have our resolvers for each connection actually return an object that contains a totalCount for us. To guarantee that resolvers correctly implement this behavior, we can define custom properties that must be returned from connection resolvers when we set up our builder:

Now typescript will ensure that objects returned from each connection resolver include a totalCount property, which we can use in our connection fields:

Note that adding additional required properties will make it harder to use the provided connection helpers since they will not automatically return your custom properties. You will need to manually add in any custom props after getting the result from the helpers:

### [Changing nullability of edges and nodes](https://pothos-graphql.dev/docs/plugins/relay#changing-nullability-of-edges-and-nodes)

If you want to change the nullability of the `edges` field on a `Connection` or the `node` field on an `Edge` you can configure this in 2 ways:

#### [Globally](https://pothos-graphql.dev/docs/plugins/relay#globally)

The types provided for `DefaultEdgesNullability` and `DefaultNodeNullability` must match the values provided in the nullable option of `edgesFieldOptions` and `nodeFieldOptions` respectively. This will set the default nullability for all connections created by your builder.

nullability for `edges` fields defaults to `{ list: options.defaultFieldNullability, items: true }` and the nullability of `node` fields is the same as `options.defaultFieldNullability` (which defaults to `true`).

#### [Per connection](https://pothos-graphql.dev/docs/plugins/relay#per-connection)

### [Extending the `Node` interface](https://pothos-graphql.dev/docs/plugins/relay#extending-the-node-interface)

Use the `nodeInterfaceRef` method of your Builder.

For example, to add a new derived field on the interface:

---

## URL: https://pothos-graphql.dev/docs/plugins/simple-objects#install

Title: Simple objects plugin

URL Source: https://pothos-graphql.dev/docs/plugins/simple-objects

Markdown Content:
Simple objects plugin

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 1: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Add GraphQL plugin](https://pothos-graphql.dev/docs/plugins/add-graphql)[Complexity plugin](https://pothos-graphql.dev/docs/plugins/complexity)[Dataloader plugin](https://pothos-graphql.dev/docs/plugins/dataloader)[Directive plugin](https://pothos-graphql.dev/docs/plugins/directives)[Drizzle plugin](https://pothos-graphql.dev/docs/plugins/drizzle)[Errors plugin](https://pothos-graphql.dev/docs/plugins/errors)[Federation plugin](https://pothos-graphql.dev/docs/plugins/federation)[Mocks plugin](https://pothos-graphql.dev/docs/plugins/mocks)[Relay plugin](https://pothos-graphql.dev/docs/plugins/relay)[Auth plugin](https://pothos-graphql.dev/docs/plugins/scope-auth)[Simple objects plugin](https://pothos-graphql.dev/docs/plugins/simple-objects)[Smart subscriptions plugin](https://pothos-graphql.dev/docs/plugins/smart-subscriptions)[SubGraph plugin](https://pothos-graphql.dev/docs/plugins/sub-graph)[Tracing plugin](https://pothos-graphql.dev/docs/plugins/tracing)[With-Input plugin](https://pothos-graphql.dev/docs/plugins/with-input)[Zod Validation plugin](https://pothos-graphql.dev/docs/plugins/zod)

[Prisma](https://pothos-graphql.dev/docs/plugins/prisma)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

Simple objects plugin Usage

[Plugins](https://pothos-graphql.dev/docs/plugins)

# Simple objects plugin

The Simple Objects Plugin provides a way to define objects and interfaces without defining type definitions for those objects, while still getting full type safety.

## [Usage](https://pothos-graphql.dev/docs/plugins/simple-objects#usage)

### [Install](https://pothos-graphql.dev/docs/plugins/simple-objects#install)

npm pnpm yarn bun

`npm install --save @pothos/plugin-simple-objects`

### [Setup](https://pothos-graphql.dev/docs/plugins/simple-objects#setup)

```
import SimpleObjectsPlugin from '@pothos/plugin-simple-objects';
const builder = new SchemaBuilder({
  plugins: [SimpleObjectsPlugin],
});
```

### [Example](https://pothos-graphql.dev/docs/plugins/simple-objects#example)

```
import SchemaBuilder from '@pothos/core';
import SimpleObjectsPlugin from '@pothos/plugin-simple-objects';

const builder = new SchemaBuilder({
  plugins: [SimpleObjectsPlugin],
});

const ContactInfo = builder.simpleObject('ContactInfo', {
  fields: (t) => ({
    email: t.string({
      nullable: false,
    }),
    phoneNumber: t.string({
      nullable: true,
    }),
  }),
});

const Node = builder.simpleInterface('Node', {
  fields: (t) => ({
    id: t.id({
      nullable: false,
    }),
  }),
});

const UserType = builder.simpleObject(
  'User',
  {
    interfaces: [Node],
    fields: (t) => ({
      firstName: t.string(),
      lastName: t.string(),
      contactInfo: t.field({
        type: ContactInfo,
        nullable: false,
      }),
    }),
  },
  // You can add additional fields with resolvers with a third fields argument
  (t) => ({
    fullName: t.string({
      resolve: (user) => `${user.firstName} ${user.lastName}`,
    }),
  }),
);

builder.queryType({
  fields: (t) => ({
    user: t.field({
      type: UserType,
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: (parent, args, { User }) => {
        return {
          id: '1003',
          firstName: 'Leia',
          lastName: 'Organa',
          contactInfo: {
            email: 'leia@example.com',
            phoneNumber: null,
          },
        };
      },
    }),
  }),
});
```

## [Extending simple objects](https://pothos-graphql.dev/docs/plugins/simple-objects#extending-simple-objects)

In some cases, you may want to add more complex fields with resolvers or args where the value isn't just passed down from the parent.

In these cases, you can either add the field in the 3rd arg (fields) as shown above, or you can add additional fields to the type using methods like `builder.objectType`:

```
builder.objectType(UserType, (t) => ({
  fullName: t.string({
    resolve: (user) => `${user.firstName} ${user.lastName}`,
  }),
}));
```

## [Limitations](https://pothos-graphql.dev/docs/plugins/simple-objects#limitations)

When using simpleObjects in combination with other plugins like authorization, those plugins may use `unknown` as the parent type in some custom fields (eg. `parent` of a permission check function on a field).

[Auth plugin Auth plugin docs for Pothos](https://pothos-graphql.dev/docs/plugins/scope-auth)[Smart subscriptions plugin Smart subscriptions plugin docs for Pothos](https://pothos-graphql.dev/docs/plugins/smart-subscriptions)

### On this page

[Usage](https://pothos-graphql.dev/docs/plugins/simple-objects#usage)[Install](https://pothos-graphql.dev/docs/plugins/simple-objects#install)[Setup](https://pothos-graphql.dev/docs/plugins/simple-objects#setup)[Example](https://pothos-graphql.dev/docs/plugins/simple-objects#example)[Extending simple objects](https://pothos-graphql.dev/docs/plugins/simple-objects#extending-simple-objects)[Limitations](https://pothos-graphql.dev/docs/plugins/simple-objects#limitations)

---

## URL: https://pothos-graphql.dev/docs/plugins/smart-subscriptions#helper-for-usage-with-async-iterators

Title: Smart subscriptions plugin

URL Source: https://pothos-graphql.dev/docs/plugins/smart-subscriptions

Markdown Content:
This plugin provides a way of turning queries into GraphQL subscriptions. Each field, Object, and Interface in a schema can define subscriptions to be registered when that field or type is used in a smart subscription.

The basic flow of a smart subscription is:

1.  Run the query the smart subscription is based on and push the initial result of that query to the subscription

2.  As the query is resolved, register any subscriptions defined on fields or types that where used in the query

3.  When any of the subscriptions are triggered, re-execute the query and push the updated data to the subscription.

There are additional options which will allow only the sub-tree of a field/type that triggered a fetch to re-resolved.

This pattern makes it easy to define subscriptions without having to worry about what parts of your schema are accessible via the subscribe query, since any type or field can register a subscription.

### [Install](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#install)

### [Setup](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#setup)

#### [Helper for usage with async iterators](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#helper-for-usage-with-async-iterators)

### [Creating a smart subscription](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#creating-a-smart-subscription)

Adding `smartSubscription: true` to a query field creates a field of the same name on the `Subscriptions` type. The `subscribe` option is optional, and shows how a field can register a subscription.

This would be queried as:

### [registering subscriptions for objects](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#registering-subscriptions-for-objects)

This will create a new subscription for every `Poll` that is returned in the subscription. When the query is updated to fetch a new set of results because a subscription event fired, the subscribe call will be called again for each poll in the new result set.

#### [more options](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#more-options)

Passing a `filter` function will filter the events, any only cause a re-fetch if it returns true.

`invalidateCache` is called before refetching data, to allow any cache invalidation to happen so that when the new data is loaded, results are not stale.

`refetch` enables directly refetching the current object. When refetch is provided and a subscription event fires for the current object, or any of its children, other parts of the query that are not dependents of this object will no be refetched.

### [registering subscriptions for fields](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#registering-subscriptions-for-fields)

#### [more options for fields](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#more-options-for-fields)

Similar to subscriptions on objects, fields can pass `filter` and `invalidateCache` functions when registering a subscription. Rather than passing a `refetch` function, you can set `canRefetch` to `true` in the field options. This will re-run the current resolve function to update it (and it's children) without having to re-run the rest of the query.

### [Known limitations](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#known-limitations)

- Currently value passed to `filter` and `invalidateCache` is typed as `unknown`. This should be improved in the future.
- Does not work with list fields implemented with async-generators (used for `@stream` queries)

---

## URL: https://pothos-graphql.dev/docs/plugins/smart-subscriptions#creating-a-smart-subscription

Title: Smart subscriptions plugin

URL Source: https://pothos-graphql.dev/docs/plugins/smart-subscriptions

Markdown Content:
This plugin provides a way of turning queries into GraphQL subscriptions. Each field, Object, and Interface in a schema can define subscriptions to be registered when that field or type is used in a smart subscription.

The basic flow of a smart subscription is:

1.  Run the query the smart subscription is based on and push the initial result of that query to the subscription

2.  As the query is resolved, register any subscriptions defined on fields or types that where used in the query

3.  When any of the subscriptions are triggered, re-execute the query and push the updated data to the subscription.

There are additional options which will allow only the sub-tree of a field/type that triggered a fetch to re-resolved.

This pattern makes it easy to define subscriptions without having to worry about what parts of your schema are accessible via the subscribe query, since any type or field can register a subscription.

### [Install](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#install)

### [Setup](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#setup)

#### [Helper for usage with async iterators](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#helper-for-usage-with-async-iterators)

### [Creating a smart subscription](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#creating-a-smart-subscription)

Adding `smartSubscription: true` to a query field creates a field of the same name on the `Subscriptions` type. The `subscribe` option is optional, and shows how a field can register a subscription.

This would be queried as:

### [registering subscriptions for objects](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#registering-subscriptions-for-objects)

This will create a new subscription for every `Poll` that is returned in the subscription. When the query is updated to fetch a new set of results because a subscription event fired, the subscribe call will be called again for each poll in the new result set.

#### [more options](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#more-options)

Passing a `filter` function will filter the events, any only cause a re-fetch if it returns true.

`invalidateCache` is called before refetching data, to allow any cache invalidation to happen so that when the new data is loaded, results are not stale.

`refetch` enables directly refetching the current object. When refetch is provided and a subscription event fires for the current object, or any of its children, other parts of the query that are not dependents of this object will no be refetched.

### [registering subscriptions for fields](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#registering-subscriptions-for-fields)

#### [more options for fields](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#more-options-for-fields)

Similar to subscriptions on objects, fields can pass `filter` and `invalidateCache` functions when registering a subscription. Rather than passing a `refetch` function, you can set `canRefetch` to `true` in the field options. This will re-run the current resolve function to update it (and it's children) without having to re-run the rest of the query.

### [Known limitations](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#known-limitations)

- Currently value passed to `filter` and `invalidateCache` is typed as `unknown`. This should be improved in the future.
- Does not work with list fields implemented with async-generators (used for `@stream` queries)

---

## URL: https://pothos-graphql.dev/docs/plugins/smart-subscriptions#registering-subscriptions-for-objects

Title: Smart subscriptions plugin

URL Source: https://pothos-graphql.dev/docs/plugins/smart-subscriptions

Markdown Content:
This plugin provides a way of turning queries into GraphQL subscriptions. Each field, Object, and Interface in a schema can define subscriptions to be registered when that field or type is used in a smart subscription.

The basic flow of a smart subscription is:

1.  Run the query the smart subscription is based on and push the initial result of that query to the subscription

2.  As the query is resolved, register any subscriptions defined on fields or types that where used in the query

3.  When any of the subscriptions are triggered, re-execute the query and push the updated data to the subscription.

There are additional options which will allow only the sub-tree of a field/type that triggered a fetch to re-resolved.

This pattern makes it easy to define subscriptions without having to worry about what parts of your schema are accessible via the subscribe query, since any type or field can register a subscription.

### [Install](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#install)

### [Setup](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#setup)

#### [Helper for usage with async iterators](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#helper-for-usage-with-async-iterators)

### [Creating a smart subscription](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#creating-a-smart-subscription)

Adding `smartSubscription: true` to a query field creates a field of the same name on the `Subscriptions` type. The `subscribe` option is optional, and shows how a field can register a subscription.

This would be queried as:

### [registering subscriptions for objects](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#registering-subscriptions-for-objects)

This will create a new subscription for every `Poll` that is returned in the subscription. When the query is updated to fetch a new set of results because a subscription event fired, the subscribe call will be called again for each poll in the new result set.

#### [more options](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#more-options)

Passing a `filter` function will filter the events, any only cause a re-fetch if it returns true.

`invalidateCache` is called before refetching data, to allow any cache invalidation to happen so that when the new data is loaded, results are not stale.

`refetch` enables directly refetching the current object. When refetch is provided and a subscription event fires for the current object, or any of its children, other parts of the query that are not dependents of this object will no be refetched.

### [registering subscriptions for fields](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#registering-subscriptions-for-fields)

#### [more options for fields](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#more-options-for-fields)

Similar to subscriptions on objects, fields can pass `filter` and `invalidateCache` functions when registering a subscription. Rather than passing a `refetch` function, you can set `canRefetch` to `true` in the field options. This will re-run the current resolve function to update it (and it's children) without having to re-run the rest of the query.

### [Known limitations](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#known-limitations)

- Currently value passed to `filter` and `invalidateCache` is typed as `unknown`. This should be improved in the future.
- Does not work with list fields implemented with async-generators (used for `@stream` queries)

---

## URL: https://pothos-graphql.dev/docs/plugins/smart-subscriptions#more-options

Title: Smart subscriptions plugin

URL Source: https://pothos-graphql.dev/docs/plugins/smart-subscriptions

Markdown Content:
This plugin provides a way of turning queries into GraphQL subscriptions. Each field, Object, and Interface in a schema can define subscriptions to be registered when that field or type is used in a smart subscription.

The basic flow of a smart subscription is:

1.  Run the query the smart subscription is based on and push the initial result of that query to the subscription

2.  As the query is resolved, register any subscriptions defined on fields or types that where used in the query

3.  When any of the subscriptions are triggered, re-execute the query and push the updated data to the subscription.

There are additional options which will allow only the sub-tree of a field/type that triggered a fetch to re-resolved.

This pattern makes it easy to define subscriptions without having to worry about what parts of your schema are accessible via the subscribe query, since any type or field can register a subscription.

### [Install](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#install)

### [Setup](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#setup)

#### [Helper for usage with async iterators](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#helper-for-usage-with-async-iterators)

### [Creating a smart subscription](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#creating-a-smart-subscription)

Adding `smartSubscription: true` to a query field creates a field of the same name on the `Subscriptions` type. The `subscribe` option is optional, and shows how a field can register a subscription.

This would be queried as:

### [registering subscriptions for objects](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#registering-subscriptions-for-objects)

This will create a new subscription for every `Poll` that is returned in the subscription. When the query is updated to fetch a new set of results because a subscription event fired, the subscribe call will be called again for each poll in the new result set.

#### [more options](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#more-options)

Passing a `filter` function will filter the events, any only cause a re-fetch if it returns true.

`invalidateCache` is called before refetching data, to allow any cache invalidation to happen so that when the new data is loaded, results are not stale.

`refetch` enables directly refetching the current object. When refetch is provided and a subscription event fires for the current object, or any of its children, other parts of the query that are not dependents of this object will no be refetched.

### [registering subscriptions for fields](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#registering-subscriptions-for-fields)

#### [more options for fields](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#more-options-for-fields)

Similar to subscriptions on objects, fields can pass `filter` and `invalidateCache` functions when registering a subscription. Rather than passing a `refetch` function, you can set `canRefetch` to `true` in the field options. This will re-run the current resolve function to update it (and it's children) without having to re-run the rest of the query.

### [Known limitations](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#known-limitations)

- Currently value passed to `filter` and `invalidateCache` is typed as `unknown`. This should be improved in the future.
- Does not work with list fields implemented with async-generators (used for `@stream` queries)

---

## URL: https://pothos-graphql.dev/docs/plugins/smart-subscriptions#known-limitations

Title: Smart subscriptions plugin

URL Source: https://pothos-graphql.dev/docs/plugins/smart-subscriptions

Markdown Content:
This plugin provides a way of turning queries into GraphQL subscriptions. Each field, Object, and Interface in a schema can define subscriptions to be registered when that field or type is used in a smart subscription.

The basic flow of a smart subscription is:

1.  Run the query the smart subscription is based on and push the initial result of that query to the subscription

2.  As the query is resolved, register any subscriptions defined on fields or types that where used in the query

3.  When any of the subscriptions are triggered, re-execute the query and push the updated data to the subscription.

There are additional options which will allow only the sub-tree of a field/type that triggered a fetch to re-resolved.

This pattern makes it easy to define subscriptions without having to worry about what parts of your schema are accessible via the subscribe query, since any type or field can register a subscription.

### [Install](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#install)

### [Setup](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#setup)

#### [Helper for usage with async iterators](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#helper-for-usage-with-async-iterators)

### [Creating a smart subscription](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#creating-a-smart-subscription)

Adding `smartSubscription: true` to a query field creates a field of the same name on the `Subscriptions` type. The `subscribe` option is optional, and shows how a field can register a subscription.

This would be queried as:

### [registering subscriptions for objects](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#registering-subscriptions-for-objects)

This will create a new subscription for every `Poll` that is returned in the subscription. When the query is updated to fetch a new set of results because a subscription event fired, the subscribe call will be called again for each poll in the new result set.

#### [more options](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#more-options)

Passing a `filter` function will filter the events, any only cause a re-fetch if it returns true.

`invalidateCache` is called before refetching data, to allow any cache invalidation to happen so that when the new data is loaded, results are not stale.

`refetch` enables directly refetching the current object. When refetch is provided and a subscription event fires for the current object, or any of its children, other parts of the query that are not dependents of this object will no be refetched.

### [registering subscriptions for fields](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#registering-subscriptions-for-fields)

#### [more options for fields](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#more-options-for-fields)

Similar to subscriptions on objects, fields can pass `filter` and `invalidateCache` functions when registering a subscription. Rather than passing a `refetch` function, you can set `canRefetch` to `true` in the field options. This will re-run the current resolve function to update it (and it's children) without having to re-run the rest of the query.

### [Known limitations](https://pothos-graphql.dev/docs/plugins/smart-subscriptions#known-limitations)

- Currently value passed to `filter` and `invalidateCache` is typed as `unknown`. This should be improved in the future.
- Does not work with list fields implemented with async-generators (used for `@stream` queries)

---

## URL: https://pothos-graphql.dev/docs/plugins/sub-graph#missing-types

Title: SubGraph plugin

URL Source: https://pothos-graphql.dev/docs/plugins/sub-graph

Markdown Content:
A plugin for creating sub-selections of your graph. This allows you to use the same code/types for multiple variants of your API.

One common use case for this is to share implementations between your public and internal APIs, by only exposing a subset of your graph publicly.

### [Install](https://pothos-graphql.dev/docs/plugins/sub-graph#install)

### [Setup](https://pothos-graphql.dev/docs/plugins/sub-graph#setup)

### [Options on Types](https://pothos-graphql.dev/docs/plugins/sub-graph#options-on-types)

- `subGraphs`: An optional array of sub-graph the type should be included in.

### [Object and Interface types:](https://pothos-graphql.dev/docs/plugins/sub-graph#object-and-interface-types)

- `defaultSubGraphsForFields`: Default sub-graph for fields of the type to be included in.

- `subGraphs`: An optional array of sub-graph the field to be included in. If not provided, will

fallback to:

    *   `defaultForFields` if set on type
    *   `subGraphs` of the type if `subGraphs.fieldsInheritFromTypes` was set in the builder
    *   an empty array

### [Options on Builder](https://pothos-graphql.dev/docs/plugins/sub-graph#options-on-builder)

- `subGraphs.defaultForTypes`: Specifies what sub-graph a type is part of by default.
- `subGraphs.fieldsInheritFromTypes`: defaults to `false`. When true, fields on a type will default to being part of the same sub-graph as their parent type. Only applies when type does not have `defaultForFields` set.

### [Usage](https://pothos-graphql.dev/docs/plugins/sub-graph#usage-1)

### [Missing types](https://pothos-graphql.dev/docs/plugins/sub-graph#missing-types)

When creating a sub-graph, the plugin will only copy in types that are included in the sub-graph, either by explicitly setting it on the type, or because the sub-graph is included in the default list. Like types, output fields that are not included in a sub-graph will also be omitted. Arguments and fields on Input types can not be removed because that would break assumptions about argument types in resolvers.

If a type that is not included in the sub-graph is referenced by another part of the graph that is included in the graph, a runtime error will be thrown when the sub graph is constructed. This can happen in a number of cases including cases where a removed type is used in the interfaces of an object, a member of a union, or the type of a field argument.

### [Explicitly including types](https://pothos-graphql.dev/docs/plugins/sub-graph#explicitly-including-types)

You can use the `explicitlyIncludeType` option to explicitly include types in a sub-graph that are unreachable. This isn't normally required, but there are some edge cases where this may be useful.

For instance, when extending external references with the federation plugin, the externalRef may not be reachable directly through your schema, but you may still want to include it when building the schema. To work around this, we can explicitly include any any types that have a `key` directive:

---

## URL: https://pothos-graphql.dev/docs/plugins/tracing#opentelemetry

Title: Tracing plugin

URL Source: https://pothos-graphql.dev/docs/plugins/tracing

Markdown Content:
This plugin adds hooks for tracing and logging resolver invocations. It also comes with a few additional packages for integrating with various tracing providers including opentelemetry, New Relic and Sentry.

### [Install](https://pothos-graphql.dev/docs/plugins/tracing#install)

### [Setup](https://pothos-graphql.dev/docs/plugins/tracing#setup)

### [Overview](https://pothos-graphql.dev/docs/plugins/tracing#overview)

The Tracing plugin is designed to have very limited overhead, and uses a modular approach to cover a wide variety of use cases.

The tracing plugin comes with a number of utility functions for implementing common patterns, and a couple of provider specific modules that can be installed separately (described in more detail below).

The primary interface to the tracing plugin consists of 3 parts:

1.  A new `tracing` option is added to each field, for enabling or configuring tracing for that field
2.  The `tracing.default` which is used as a fallback for any field that does not explicitly set its `tracing` options.
3.  The `tracing.wrap` function, which takes a resolver, the tracing option for a field, and a field configuration object, and should return a wrapped/traced version of the resolver.

### [Enabling tracing for a field](https://pothos-graphql.dev/docs/plugins/tracing#enabling-tracing-for-a-field)

Enabling tracing on a field is as simple as setting the tracing option to `true`

#### [Custom tracing options](https://pothos-graphql.dev/docs/plugins/tracing#custom-tracing-options)

For more advanced tracing setups, you may want to allow fields to provide additional tracing options. You can do this by customizing the `Tracing` generic in the builder.

### [Enabling tracing by default](https://pothos-graphql.dev/docs/plugins/tracing#enabling-tracing-by-default)

In most applications you won't want to configure tracing for each field. Instead you can use the `tracing.default` to enable tracing for specific types of fields.

There are a number of utility functions for detecting certain types of fields. For most applications tracing every resolver will add significant overhead with very little benefit. The following utilities exported by the tracing plugin can be used to determine which fields should have tracing enabled by default.

- `isRootField`: Returns true for fields of the `Query`, `Mutation`, and `Subscription` types
- `isScalarField`: Returns true for fields that return Scalars, or lists of scalars
- `isEnumField`: Returns true for fields that return an Enum or list of Enums
- `isExposedField`: Returns true for fields defined with the `t.expose*` field builder methods, or fields that use the `defaultFieldResolver`.

### [Implementing a tracer](https://pothos-graphql.dev/docs/plugins/tracing#implementing-a-tracer)

Tracers work by wrapping the execution of resolver calls. The `tracing.wrap` function keeps this process as minimal as possible by simply providing the resolver for a field, and expecting a wrapped version of the resolver to be returned. Resolvers can throw errors or return promises, and correctly handling these edge cases can be a little complicated so the tracing plugin also comes with some helpers utilities to simplify this process.

`tracing.wrap` takes 3 arguments:

1.  `resolver`: the resolver for a field
2.  `options`: the tracing options for the field (set either on the field, or returned by `tracing.default`).
3.  `fieldConfig`: A config object that describes the field being wrapped

The `wrapResolver` utility takes a resolver, and a `onEnd` callback, and returns a wrapped version of the resolver that will call the callback with an error (or null) and the duration the resolver took to complete.

The `runFunction` helper is similar, but rather than wrapping a resolver, will immediately execute a function with no arguments. This can be useful for more complex use cases where you need access to other resolver arguments, or want to add your own logic before the resolver begins executing.

### [Using resolver arguments in tracers](https://pothos-graphql.dev/docs/plugins/tracing#using-resolver-arguments-in-tracers)

When defining tracing options for a field, you may want to pass some resolver args to your tracing logic.

The follow example shows how arguments might be passed to a tracer to be attached to a span:

The `default` option can also return a function to access resolver arguments:

It is important to know that if a field uses a function to return its tracing option (either directly on the field definition, or as a default) the behavior of the `wrap` function changes slightly.

By default `wrap` is called for each field when the schema is built. For fields that return their tracing option via a function, wrap will be called whenever the field is executed because the tracing options are dependent on the resolver arguments.

For many uses cases this does not add a lot of overhead, but as a rule of thumb, it is always more efficient to use tracing options that don't depend on the resolver value.

The above example could be re-designed slightly to improve tracing performance:

### [Opentelemetry](https://pothos-graphql.dev/docs/plugins/tracing#opentelemetry)

#### [install](https://pothos-graphql.dev/docs/plugins/tracing#install-1)

#### [Basic usage](https://pothos-graphql.dev/docs/plugins/tracing#basic-usage)

#### [options](https://pothos-graphql.dev/docs/plugins/tracing#options)

- `includeArgs`: default: `false`
- `includeSource`: default: `false`
- `ignoreError`: default: `false`
- `onSpan`: `(span, tracingOptions, parent, args, context, info) => void`

#### [Adding custom attributes to spans](https://pothos-graphql.dev/docs/plugins/tracing#adding-custom-attributes-to-spans)

#### [Instrumenting the execution phase](https://pothos-graphql.dev/docs/plugins/tracing#instrumenting-the-execution-phase)

The tracing plugin for Pothos only adds spans for resolvers. You may also want to capture additional information about other parts of the graphql execution process.

This example uses GraphQL Yoga, by providing a custom envelop plugin that wraps the execution phase. Many graphql server implementations have ways to wrap or replace the execution call, but will look slightly different.

Envelop also provides its own opentelemetry plugin which can be used instead of a custom plugin like the one shown above. The biggest drawback to this is the current version of `@envelop/opentelemetry` does not track the parent/child relations of spans it creates.

#### [Setting up a tracer](https://pothos-graphql.dev/docs/plugins/tracing#setting-up-a-tracer)

The following setup creates a very simple opentelemetry tracer that will log spans to the console. Real applications will need to define exporters that match the opentelemetry backend you are using.

### [Datadog](https://pothos-graphql.dev/docs/plugins/tracing#datadog)

Datadog supports opentelemetry. To report traces to datadog, you will need to instrument your application with an opentelemetry tracer, and configure your datadog agent to collect open telemetry traces.

#### [Creating a tracer that exports to datadog](https://pothos-graphql.dev/docs/plugins/tracing#creating-a-tracer-that-exports-to-datadog)

#### [Configuring the datadog agent to collect open telemetry](https://pothos-graphql.dev/docs/plugins/tracing#configuring-the-datadog-agent-to-collect-open-telemetry)

Add the following to your datadog agent configuration

### [New Relic](https://pothos-graphql.dev/docs/plugins/tracing#new-relic)

#### [install](https://pothos-graphql.dev/docs/plugins/tracing#install-2)

#### [Basic usage](https://pothos-graphql.dev/docs/plugins/tracing#basic-usage-1)

#### [options](https://pothos-graphql.dev/docs/plugins/tracing#options-1)

- `includeArgs`: default: `false`
- `includeSource`: default: `false`

#### [Instrumenting the execution phase](https://pothos-graphql.dev/docs/plugins/tracing#instrumenting-the-execution-phase-1)

The tracing plugin for Pothos only adds spans for resolvers. You may also want to capture additional information about other parts of the graphql execution process.

This example uses GraphQL Yoga, by providing a custom envelop plugin that wraps the execution phase. Many graphql server implementations have ways to wrap or replace the execution call, but will look slightly different.

### [Using the envelop newrelic plugin](https://pothos-graphql.dev/docs/plugins/tracing#using-the-envelop-newrelic-plugin)

Envelop has it's own plugin for newrelic that can be combined with the tracing plugin:

### [Sentry](https://pothos-graphql.dev/docs/plugins/tracing#sentry)

#### [install](https://pothos-graphql.dev/docs/plugins/tracing#install-3)

#### [Basic usage](https://pothos-graphql.dev/docs/plugins/tracing#basic-usage-2)

#### [options](https://pothos-graphql.dev/docs/plugins/tracing#options-2)

- `includeArgs`: default: `false`
- `includeSource`: default: `false`
- `ignoreError`: default: `false`

#### [Instrumenting the execution phase](https://pothos-graphql.dev/docs/plugins/tracing#instrumenting-the-execution-phase-2)

The tracing plugin for Pothos only adds spans for resolvers. You may also want to capture additional information about other parts of the graphql execution process.

This example uses GraphQL Yoga, by providing a custom envelop plugin that wraps the execution phase. Many graphql server implementations have ways to wrap or replace the execution call, but will look slightly different.

### [Using the envelop sentry plugin](https://pothos-graphql.dev/docs/plugins/tracing#using-the-envelop-sentry-plugin)

Envelop has it's own plugin for Sentry that can be combined with the tracing plugin:

### [AWS XRay](https://pothos-graphql.dev/docs/plugins/tracing#aws-xray)

#### [install](https://pothos-graphql.dev/docs/plugins/tracing#install-4)

#### [Basic usage](https://pothos-graphql.dev/docs/plugins/tracing#basic-usage-3)

#### [options](https://pothos-graphql.dev/docs/plugins/tracing#options-3)

- `includeArgs`: default: `false`
- `includeSource`: default: `false`

#### [Instrumenting the execution phase](https://pothos-graphql.dev/docs/plugins/tracing#instrumenting-the-execution-phase-3)

The tracing plugin for Pothos only adds spans for resolvers. You may also want to capture additional information about other parts of the graphql execution process.

This example uses GraphQL Yoga, by providing a custom envelop plugin that wraps the execution phase. Many graphql server implementations have ways to wrap or replace the execution call, but will look slightly different.

---

## URL: https://pothos-graphql.dev/docs/plugins/tracing#new-relic

Title: Tracing plugin

URL Source: https://pothos-graphql.dev/docs/plugins/tracing

Markdown Content:
This plugin adds hooks for tracing and logging resolver invocations. It also comes with a few additional packages for integrating with various tracing providers including opentelemetry, New Relic and Sentry.

### [Install](https://pothos-graphql.dev/docs/plugins/tracing#install)

### [Setup](https://pothos-graphql.dev/docs/plugins/tracing#setup)

### [Overview](https://pothos-graphql.dev/docs/plugins/tracing#overview)

The Tracing plugin is designed to have very limited overhead, and uses a modular approach to cover a wide variety of use cases.

The tracing plugin comes with a number of utility functions for implementing common patterns, and a couple of provider specific modules that can be installed separately (described in more detail below).

The primary interface to the tracing plugin consists of 3 parts:

1.  A new `tracing` option is added to each field, for enabling or configuring tracing for that field
2.  The `tracing.default` which is used as a fallback for any field that does not explicitly set its `tracing` options.
3.  The `tracing.wrap` function, which takes a resolver, the tracing option for a field, and a field configuration object, and should return a wrapped/traced version of the resolver.

### [Enabling tracing for a field](https://pothos-graphql.dev/docs/plugins/tracing#enabling-tracing-for-a-field)

Enabling tracing on a field is as simple as setting the tracing option to `true`

#### [Custom tracing options](https://pothos-graphql.dev/docs/plugins/tracing#custom-tracing-options)

For more advanced tracing setups, you may want to allow fields to provide additional tracing options. You can do this by customizing the `Tracing` generic in the builder.

### [Enabling tracing by default](https://pothos-graphql.dev/docs/plugins/tracing#enabling-tracing-by-default)

In most applications you won't want to configure tracing for each field. Instead you can use the `tracing.default` to enable tracing for specific types of fields.

There are a number of utility functions for detecting certain types of fields. For most applications tracing every resolver will add significant overhead with very little benefit. The following utilities exported by the tracing plugin can be used to determine which fields should have tracing enabled by default.

- `isRootField`: Returns true for fields of the `Query`, `Mutation`, and `Subscription` types
- `isScalarField`: Returns true for fields that return Scalars, or lists of scalars
- `isEnumField`: Returns true for fields that return an Enum or list of Enums
- `isExposedField`: Returns true for fields defined with the `t.expose*` field builder methods, or fields that use the `defaultFieldResolver`.

### [Implementing a tracer](https://pothos-graphql.dev/docs/plugins/tracing#implementing-a-tracer)

Tracers work by wrapping the execution of resolver calls. The `tracing.wrap` function keeps this process as minimal as possible by simply providing the resolver for a field, and expecting a wrapped version of the resolver to be returned. Resolvers can throw errors or return promises, and correctly handling these edge cases can be a little complicated so the tracing plugin also comes with some helpers utilities to simplify this process.

`tracing.wrap` takes 3 arguments:

1.  `resolver`: the resolver for a field
2.  `options`: the tracing options for the field (set either on the field, or returned by `tracing.default`).
3.  `fieldConfig`: A config object that describes the field being wrapped

The `wrapResolver` utility takes a resolver, and a `onEnd` callback, and returns a wrapped version of the resolver that will call the callback with an error (or null) and the duration the resolver took to complete.

The `runFunction` helper is similar, but rather than wrapping a resolver, will immediately execute a function with no arguments. This can be useful for more complex use cases where you need access to other resolver arguments, or want to add your own logic before the resolver begins executing.

### [Using resolver arguments in tracers](https://pothos-graphql.dev/docs/plugins/tracing#using-resolver-arguments-in-tracers)

When defining tracing options for a field, you may want to pass some resolver args to your tracing logic.

The follow example shows how arguments might be passed to a tracer to be attached to a span:

The `default` option can also return a function to access resolver arguments:

It is important to know that if a field uses a function to return its tracing option (either directly on the field definition, or as a default) the behavior of the `wrap` function changes slightly.

By default `wrap` is called for each field when the schema is built. For fields that return their tracing option via a function, wrap will be called whenever the field is executed because the tracing options are dependent on the resolver arguments.

For many uses cases this does not add a lot of overhead, but as a rule of thumb, it is always more efficient to use tracing options that don't depend on the resolver value.

The above example could be re-designed slightly to improve tracing performance:

### [Opentelemetry](https://pothos-graphql.dev/docs/plugins/tracing#opentelemetry)

#### [install](https://pothos-graphql.dev/docs/plugins/tracing#install-1)

#### [Basic usage](https://pothos-graphql.dev/docs/plugins/tracing#basic-usage)

#### [options](https://pothos-graphql.dev/docs/plugins/tracing#options)

- `includeArgs`: default: `false`
- `includeSource`: default: `false`
- `ignoreError`: default: `false`
- `onSpan`: `(span, tracingOptions, parent, args, context, info) => void`

#### [Adding custom attributes to spans](https://pothos-graphql.dev/docs/plugins/tracing#adding-custom-attributes-to-spans)

#### [Instrumenting the execution phase](https://pothos-graphql.dev/docs/plugins/tracing#instrumenting-the-execution-phase)

The tracing plugin for Pothos only adds spans for resolvers. You may also want to capture additional information about other parts of the graphql execution process.

This example uses GraphQL Yoga, by providing a custom envelop plugin that wraps the execution phase. Many graphql server implementations have ways to wrap or replace the execution call, but will look slightly different.

Envelop also provides its own opentelemetry plugin which can be used instead of a custom plugin like the one shown above. The biggest drawback to this is the current version of `@envelop/opentelemetry` does not track the parent/child relations of spans it creates.

#### [Setting up a tracer](https://pothos-graphql.dev/docs/plugins/tracing#setting-up-a-tracer)

The following setup creates a very simple opentelemetry tracer that will log spans to the console. Real applications will need to define exporters that match the opentelemetry backend you are using.

### [Datadog](https://pothos-graphql.dev/docs/plugins/tracing#datadog)

Datadog supports opentelemetry. To report traces to datadog, you will need to instrument your application with an opentelemetry tracer, and configure your datadog agent to collect open telemetry traces.

#### [Creating a tracer that exports to datadog](https://pothos-graphql.dev/docs/plugins/tracing#creating-a-tracer-that-exports-to-datadog)

#### [Configuring the datadog agent to collect open telemetry](https://pothos-graphql.dev/docs/plugins/tracing#configuring-the-datadog-agent-to-collect-open-telemetry)

Add the following to your datadog agent configuration

### [New Relic](https://pothos-graphql.dev/docs/plugins/tracing#new-relic)

#### [install](https://pothos-graphql.dev/docs/plugins/tracing#install-2)

#### [Basic usage](https://pothos-graphql.dev/docs/plugins/tracing#basic-usage-1)

#### [options](https://pothos-graphql.dev/docs/plugins/tracing#options-1)

- `includeArgs`: default: `false`
- `includeSource`: default: `false`

#### [Instrumenting the execution phase](https://pothos-graphql.dev/docs/plugins/tracing#instrumenting-the-execution-phase-1)

The tracing plugin for Pothos only adds spans for resolvers. You may also want to capture additional information about other parts of the graphql execution process.

This example uses GraphQL Yoga, by providing a custom envelop plugin that wraps the execution phase. Many graphql server implementations have ways to wrap or replace the execution call, but will look slightly different.

### [Using the envelop newrelic plugin](https://pothos-graphql.dev/docs/plugins/tracing#using-the-envelop-newrelic-plugin)

Envelop has it's own plugin for newrelic that can be combined with the tracing plugin:

### [Sentry](https://pothos-graphql.dev/docs/plugins/tracing#sentry)

#### [install](https://pothos-graphql.dev/docs/plugins/tracing#install-3)

#### [Basic usage](https://pothos-graphql.dev/docs/plugins/tracing#basic-usage-2)

#### [options](https://pothos-graphql.dev/docs/plugins/tracing#options-2)

- `includeArgs`: default: `false`
- `includeSource`: default: `false`
- `ignoreError`: default: `false`

#### [Instrumenting the execution phase](https://pothos-graphql.dev/docs/plugins/tracing#instrumenting-the-execution-phase-2)

The tracing plugin for Pothos only adds spans for resolvers. You may also want to capture additional information about other parts of the graphql execution process.

This example uses GraphQL Yoga, by providing a custom envelop plugin that wraps the execution phase. Many graphql server implementations have ways to wrap or replace the execution call, but will look slightly different.

### [Using the envelop sentry plugin](https://pothos-graphql.dev/docs/plugins/tracing#using-the-envelop-sentry-plugin)

Envelop has it's own plugin for Sentry that can be combined with the tracing plugin:

### [AWS XRay](https://pothos-graphql.dev/docs/plugins/tracing#aws-xray)

#### [install](https://pothos-graphql.dev/docs/plugins/tracing#install-4)

#### [Basic usage](https://pothos-graphql.dev/docs/plugins/tracing#basic-usage-3)

#### [options](https://pothos-graphql.dev/docs/plugins/tracing#options-3)

- `includeArgs`: default: `false`
- `includeSource`: default: `false`

#### [Instrumenting the execution phase](https://pothos-graphql.dev/docs/plugins/tracing#instrumenting-the-execution-phase-3)

The tracing plugin for Pothos only adds spans for resolvers. You may also want to capture additional information about other parts of the graphql execution process.

This example uses GraphQL Yoga, by providing a custom envelop plugin that wraps the execution phase. Many graphql server implementations have ways to wrap or replace the execution call, but will look slightly different.

---

## URL: https://pothos-graphql.dev/docs/plugins/tracing#install-3

Title: Tracing plugin

URL Source: https://pothos-graphql.dev/docs/plugins/tracing

Markdown Content:
This plugin adds hooks for tracing and logging resolver invocations. It also comes with a few additional packages for integrating with various tracing providers including opentelemetry, New Relic and Sentry.

### [Install](https://pothos-graphql.dev/docs/plugins/tracing#install)

### [Setup](https://pothos-graphql.dev/docs/plugins/tracing#setup)

### [Overview](https://pothos-graphql.dev/docs/plugins/tracing#overview)

The Tracing plugin is designed to have very limited overhead, and uses a modular approach to cover a wide variety of use cases.

The tracing plugin comes with a number of utility functions for implementing common patterns, and a couple of provider specific modules that can be installed separately (described in more detail below).

The primary interface to the tracing plugin consists of 3 parts:

1.  A new `tracing` option is added to each field, for enabling or configuring tracing for that field
2.  The `tracing.default` which is used as a fallback for any field that does not explicitly set its `tracing` options.
3.  The `tracing.wrap` function, which takes a resolver, the tracing option for a field, and a field configuration object, and should return a wrapped/traced version of the resolver.

### [Enabling tracing for a field](https://pothos-graphql.dev/docs/plugins/tracing#enabling-tracing-for-a-field)

Enabling tracing on a field is as simple as setting the tracing option to `true`

#### [Custom tracing options](https://pothos-graphql.dev/docs/plugins/tracing#custom-tracing-options)

For more advanced tracing setups, you may want to allow fields to provide additional tracing options. You can do this by customizing the `Tracing` generic in the builder.

### [Enabling tracing by default](https://pothos-graphql.dev/docs/plugins/tracing#enabling-tracing-by-default)

In most applications you won't want to configure tracing for each field. Instead you can use the `tracing.default` to enable tracing for specific types of fields.

There are a number of utility functions for detecting certain types of fields. For most applications tracing every resolver will add significant overhead with very little benefit. The following utilities exported by the tracing plugin can be used to determine which fields should have tracing enabled by default.

- `isRootField`: Returns true for fields of the `Query`, `Mutation`, and `Subscription` types
- `isScalarField`: Returns true for fields that return Scalars, or lists of scalars
- `isEnumField`: Returns true for fields that return an Enum or list of Enums
- `isExposedField`: Returns true for fields defined with the `t.expose*` field builder methods, or fields that use the `defaultFieldResolver`.

### [Implementing a tracer](https://pothos-graphql.dev/docs/plugins/tracing#implementing-a-tracer)

Tracers work by wrapping the execution of resolver calls. The `tracing.wrap` function keeps this process as minimal as possible by simply providing the resolver for a field, and expecting a wrapped version of the resolver to be returned. Resolvers can throw errors or return promises, and correctly handling these edge cases can be a little complicated so the tracing plugin also comes with some helpers utilities to simplify this process.

`tracing.wrap` takes 3 arguments:

1.  `resolver`: the resolver for a field
2.  `options`: the tracing options for the field (set either on the field, or returned by `tracing.default`).
3.  `fieldConfig`: A config object that describes the field being wrapped

The `wrapResolver` utility takes a resolver, and a `onEnd` callback, and returns a wrapped version of the resolver that will call the callback with an error (or null) and the duration the resolver took to complete.

The `runFunction` helper is similar, but rather than wrapping a resolver, will immediately execute a function with no arguments. This can be useful for more complex use cases where you need access to other resolver arguments, or want to add your own logic before the resolver begins executing.

### [Using resolver arguments in tracers](https://pothos-graphql.dev/docs/plugins/tracing#using-resolver-arguments-in-tracers)

When defining tracing options for a field, you may want to pass some resolver args to your tracing logic.

The follow example shows how arguments might be passed to a tracer to be attached to a span:

The `default` option can also return a function to access resolver arguments:

It is important to know that if a field uses a function to return its tracing option (either directly on the field definition, or as a default) the behavior of the `wrap` function changes slightly.

By default `wrap` is called for each field when the schema is built. For fields that return their tracing option via a function, wrap will be called whenever the field is executed because the tracing options are dependent on the resolver arguments.

For many uses cases this does not add a lot of overhead, but as a rule of thumb, it is always more efficient to use tracing options that don't depend on the resolver value.

The above example could be re-designed slightly to improve tracing performance:

### [Opentelemetry](https://pothos-graphql.dev/docs/plugins/tracing#opentelemetry)

#### [install](https://pothos-graphql.dev/docs/plugins/tracing#install-1)

#### [Basic usage](https://pothos-graphql.dev/docs/plugins/tracing#basic-usage)

#### [options](https://pothos-graphql.dev/docs/plugins/tracing#options)

- `includeArgs`: default: `false`
- `includeSource`: default: `false`
- `ignoreError`: default: `false`
- `onSpan`: `(span, tracingOptions, parent, args, context, info) => void`

#### [Adding custom attributes to spans](https://pothos-graphql.dev/docs/plugins/tracing#adding-custom-attributes-to-spans)

#### [Instrumenting the execution phase](https://pothos-graphql.dev/docs/plugins/tracing#instrumenting-the-execution-phase)

The tracing plugin for Pothos only adds spans for resolvers. You may also want to capture additional information about other parts of the graphql execution process.

This example uses GraphQL Yoga, by providing a custom envelop plugin that wraps the execution phase. Many graphql server implementations have ways to wrap or replace the execution call, but will look slightly different.

Envelop also provides its own opentelemetry plugin which can be used instead of a custom plugin like the one shown above. The biggest drawback to this is the current version of `@envelop/opentelemetry` does not track the parent/child relations of spans it creates.

#### [Setting up a tracer](https://pothos-graphql.dev/docs/plugins/tracing#setting-up-a-tracer)

The following setup creates a very simple opentelemetry tracer that will log spans to the console. Real applications will need to define exporters that match the opentelemetry backend you are using.

### [Datadog](https://pothos-graphql.dev/docs/plugins/tracing#datadog)

Datadog supports opentelemetry. To report traces to datadog, you will need to instrument your application with an opentelemetry tracer, and configure your datadog agent to collect open telemetry traces.

#### [Creating a tracer that exports to datadog](https://pothos-graphql.dev/docs/plugins/tracing#creating-a-tracer-that-exports-to-datadog)

#### [Configuring the datadog agent to collect open telemetry](https://pothos-graphql.dev/docs/plugins/tracing#configuring-the-datadog-agent-to-collect-open-telemetry)

Add the following to your datadog agent configuration

### [New Relic](https://pothos-graphql.dev/docs/plugins/tracing#new-relic)

#### [install](https://pothos-graphql.dev/docs/plugins/tracing#install-2)

#### [Basic usage](https://pothos-graphql.dev/docs/plugins/tracing#basic-usage-1)

#### [options](https://pothos-graphql.dev/docs/plugins/tracing#options-1)

- `includeArgs`: default: `false`
- `includeSource`: default: `false`

#### [Instrumenting the execution phase](https://pothos-graphql.dev/docs/plugins/tracing#instrumenting-the-execution-phase-1)

The tracing plugin for Pothos only adds spans for resolvers. You may also want to capture additional information about other parts of the graphql execution process.

This example uses GraphQL Yoga, by providing a custom envelop plugin that wraps the execution phase. Many graphql server implementations have ways to wrap or replace the execution call, but will look slightly different.

### [Using the envelop newrelic plugin](https://pothos-graphql.dev/docs/plugins/tracing#using-the-envelop-newrelic-plugin)

Envelop has it's own plugin for newrelic that can be combined with the tracing plugin:

### [Sentry](https://pothos-graphql.dev/docs/plugins/tracing#sentry)

#### [install](https://pothos-graphql.dev/docs/plugins/tracing#install-3)

#### [Basic usage](https://pothos-graphql.dev/docs/plugins/tracing#basic-usage-2)

#### [options](https://pothos-graphql.dev/docs/plugins/tracing#options-2)

- `includeArgs`: default: `false`
- `includeSource`: default: `false`
- `ignoreError`: default: `false`

#### [Instrumenting the execution phase](https://pothos-graphql.dev/docs/plugins/tracing#instrumenting-the-execution-phase-2)

The tracing plugin for Pothos only adds spans for resolvers. You may also want to capture additional information about other parts of the graphql execution process.

This example uses GraphQL Yoga, by providing a custom envelop plugin that wraps the execution phase. Many graphql server implementations have ways to wrap or replace the execution call, but will look slightly different.

### [Using the envelop sentry plugin](https://pothos-graphql.dev/docs/plugins/tracing#using-the-envelop-sentry-plugin)

Envelop has it's own plugin for Sentry that can be combined with the tracing plugin:

### [AWS XRay](https://pothos-graphql.dev/docs/plugins/tracing#aws-xray)

#### [install](https://pothos-graphql.dev/docs/plugins/tracing#install-4)

#### [Basic usage](https://pothos-graphql.dev/docs/plugins/tracing#basic-usage-3)

#### [options](https://pothos-graphql.dev/docs/plugins/tracing#options-3)

- `includeArgs`: default: `false`
- `includeSource`: default: `false`

#### [Instrumenting the execution phase](https://pothos-graphql.dev/docs/plugins/tracing#instrumenting-the-execution-phase-3)

The tracing plugin for Pothos only adds spans for resolvers. You may also want to capture additional information about other parts of the graphql execution process.

This example uses GraphQL Yoga, by providing a custom envelop plugin that wraps the execution phase. Many graphql server implementations have ways to wrap or replace the execution call, but will look slightly different.

---

## URL: https://pothos-graphql.dev/docs/plugins/tracing#install-4

Title: Tracing plugin

URL Source: https://pothos-graphql.dev/docs/plugins/tracing

Markdown Content:
This plugin adds hooks for tracing and logging resolver invocations. It also comes with a few additional packages for integrating with various tracing providers including opentelemetry, New Relic and Sentry.

### [Install](https://pothos-graphql.dev/docs/plugins/tracing#install)

### [Setup](https://pothos-graphql.dev/docs/plugins/tracing#setup)

### [Overview](https://pothos-graphql.dev/docs/plugins/tracing#overview)

The Tracing plugin is designed to have very limited overhead, and uses a modular approach to cover a wide variety of use cases.

The tracing plugin comes with a number of utility functions for implementing common patterns, and a couple of provider specific modules that can be installed separately (described in more detail below).

The primary interface to the tracing plugin consists of 3 parts:

1.  A new `tracing` option is added to each field, for enabling or configuring tracing for that field
2.  The `tracing.default` which is used as a fallback for any field that does not explicitly set its `tracing` options.
3.  The `tracing.wrap` function, which takes a resolver, the tracing option for a field, and a field configuration object, and should return a wrapped/traced version of the resolver.

### [Enabling tracing for a field](https://pothos-graphql.dev/docs/plugins/tracing#enabling-tracing-for-a-field)

Enabling tracing on a field is as simple as setting the tracing option to `true`

#### [Custom tracing options](https://pothos-graphql.dev/docs/plugins/tracing#custom-tracing-options)

For more advanced tracing setups, you may want to allow fields to provide additional tracing options. You can do this by customizing the `Tracing` generic in the builder.

### [Enabling tracing by default](https://pothos-graphql.dev/docs/plugins/tracing#enabling-tracing-by-default)

In most applications you won't want to configure tracing for each field. Instead you can use the `tracing.default` to enable tracing for specific types of fields.

There are a number of utility functions for detecting certain types of fields. For most applications tracing every resolver will add significant overhead with very little benefit. The following utilities exported by the tracing plugin can be used to determine which fields should have tracing enabled by default.

- `isRootField`: Returns true for fields of the `Query`, `Mutation`, and `Subscription` types
- `isScalarField`: Returns true for fields that return Scalars, or lists of scalars
- `isEnumField`: Returns true for fields that return an Enum or list of Enums
- `isExposedField`: Returns true for fields defined with the `t.expose*` field builder methods, or fields that use the `defaultFieldResolver`.

### [Implementing a tracer](https://pothos-graphql.dev/docs/plugins/tracing#implementing-a-tracer)

Tracers work by wrapping the execution of resolver calls. The `tracing.wrap` function keeps this process as minimal as possible by simply providing the resolver for a field, and expecting a wrapped version of the resolver to be returned. Resolvers can throw errors or return promises, and correctly handling these edge cases can be a little complicated so the tracing plugin also comes with some helpers utilities to simplify this process.

`tracing.wrap` takes 3 arguments:

1.  `resolver`: the resolver for a field
2.  `options`: the tracing options for the field (set either on the field, or returned by `tracing.default`).
3.  `fieldConfig`: A config object that describes the field being wrapped

The `wrapResolver` utility takes a resolver, and a `onEnd` callback, and returns a wrapped version of the resolver that will call the callback with an error (or null) and the duration the resolver took to complete.

The `runFunction` helper is similar, but rather than wrapping a resolver, will immediately execute a function with no arguments. This can be useful for more complex use cases where you need access to other resolver arguments, or want to add your own logic before the resolver begins executing.

### [Using resolver arguments in tracers](https://pothos-graphql.dev/docs/plugins/tracing#using-resolver-arguments-in-tracers)

When defining tracing options for a field, you may want to pass some resolver args to your tracing logic.

The follow example shows how arguments might be passed to a tracer to be attached to a span:

The `default` option can also return a function to access resolver arguments:

It is important to know that if a field uses a function to return its tracing option (either directly on the field definition, or as a default) the behavior of the `wrap` function changes slightly.

By default `wrap` is called for each field when the schema is built. For fields that return their tracing option via a function, wrap will be called whenever the field is executed because the tracing options are dependent on the resolver arguments.

For many uses cases this does not add a lot of overhead, but as a rule of thumb, it is always more efficient to use tracing options that don't depend on the resolver value.

The above example could be re-designed slightly to improve tracing performance:

### [Opentelemetry](https://pothos-graphql.dev/docs/plugins/tracing#opentelemetry)

#### [install](https://pothos-graphql.dev/docs/plugins/tracing#install-1)

#### [Basic usage](https://pothos-graphql.dev/docs/plugins/tracing#basic-usage)

#### [options](https://pothos-graphql.dev/docs/plugins/tracing#options)

- `includeArgs`: default: `false`
- `includeSource`: default: `false`
- `ignoreError`: default: `false`
- `onSpan`: `(span, tracingOptions, parent, args, context, info) => void`

#### [Adding custom attributes to spans](https://pothos-graphql.dev/docs/plugins/tracing#adding-custom-attributes-to-spans)

#### [Instrumenting the execution phase](https://pothos-graphql.dev/docs/plugins/tracing#instrumenting-the-execution-phase)

The tracing plugin for Pothos only adds spans for resolvers. You may also want to capture additional information about other parts of the graphql execution process.

This example uses GraphQL Yoga, by providing a custom envelop plugin that wraps the execution phase. Many graphql server implementations have ways to wrap or replace the execution call, but will look slightly different.

Envelop also provides its own opentelemetry plugin which can be used instead of a custom plugin like the one shown above. The biggest drawback to this is the current version of `@envelop/opentelemetry` does not track the parent/child relations of spans it creates.

#### [Setting up a tracer](https://pothos-graphql.dev/docs/plugins/tracing#setting-up-a-tracer)

The following setup creates a very simple opentelemetry tracer that will log spans to the console. Real applications will need to define exporters that match the opentelemetry backend you are using.

### [Datadog](https://pothos-graphql.dev/docs/plugins/tracing#datadog)

Datadog supports opentelemetry. To report traces to datadog, you will need to instrument your application with an opentelemetry tracer, and configure your datadog agent to collect open telemetry traces.

#### [Creating a tracer that exports to datadog](https://pothos-graphql.dev/docs/plugins/tracing#creating-a-tracer-that-exports-to-datadog)

#### [Configuring the datadog agent to collect open telemetry](https://pothos-graphql.dev/docs/plugins/tracing#configuring-the-datadog-agent-to-collect-open-telemetry)

Add the following to your datadog agent configuration

### [New Relic](https://pothos-graphql.dev/docs/plugins/tracing#new-relic)

#### [install](https://pothos-graphql.dev/docs/plugins/tracing#install-2)

#### [Basic usage](https://pothos-graphql.dev/docs/plugins/tracing#basic-usage-1)

#### [options](https://pothos-graphql.dev/docs/plugins/tracing#options-1)

- `includeArgs`: default: `false`
- `includeSource`: default: `false`

#### [Instrumenting the execution phase](https://pothos-graphql.dev/docs/plugins/tracing#instrumenting-the-execution-phase-1)

The tracing plugin for Pothos only adds spans for resolvers. You may also want to capture additional information about other parts of the graphql execution process.

This example uses GraphQL Yoga, by providing a custom envelop plugin that wraps the execution phase. Many graphql server implementations have ways to wrap or replace the execution call, but will look slightly different.

### [Using the envelop newrelic plugin](https://pothos-graphql.dev/docs/plugins/tracing#using-the-envelop-newrelic-plugin)

Envelop has it's own plugin for newrelic that can be combined with the tracing plugin:

### [Sentry](https://pothos-graphql.dev/docs/plugins/tracing#sentry)

#### [install](https://pothos-graphql.dev/docs/plugins/tracing#install-3)

#### [Basic usage](https://pothos-graphql.dev/docs/plugins/tracing#basic-usage-2)

#### [options](https://pothos-graphql.dev/docs/plugins/tracing#options-2)

- `includeArgs`: default: `false`
- `includeSource`: default: `false`
- `ignoreError`: default: `false`

#### [Instrumenting the execution phase](https://pothos-graphql.dev/docs/plugins/tracing#instrumenting-the-execution-phase-2)

The tracing plugin for Pothos only adds spans for resolvers. You may also want to capture additional information about other parts of the graphql execution process.

This example uses GraphQL Yoga, by providing a custom envelop plugin that wraps the execution phase. Many graphql server implementations have ways to wrap or replace the execution call, but will look slightly different.

### [Using the envelop sentry plugin](https://pothos-graphql.dev/docs/plugins/tracing#using-the-envelop-sentry-plugin)

Envelop has it's own plugin for Sentry that can be combined with the tracing plugin:

### [AWS XRay](https://pothos-graphql.dev/docs/plugins/tracing#aws-xray)

#### [install](https://pothos-graphql.dev/docs/plugins/tracing#install-4)

#### [Basic usage](https://pothos-graphql.dev/docs/plugins/tracing#basic-usage-3)

#### [options](https://pothos-graphql.dev/docs/plugins/tracing#options-3)

- `includeArgs`: default: `false`
- `includeSource`: default: `false`

#### [Instrumenting the execution phase](https://pothos-graphql.dev/docs/plugins/tracing#instrumenting-the-execution-phase-3)

The tracing plugin for Pothos only adds spans for resolvers. You may also want to capture additional information about other parts of the graphql execution process.

This example uses GraphQL Yoga, by providing a custom envelop plugin that wraps the execution phase. Many graphql server implementations have ways to wrap or replace the execution call, but will look slightly different.

---

## URL: https://pothos-graphql.dev/docs/plugins/with-input#install

Title: With-Input plugin

URL Source: https://pothos-graphql.dev/docs/plugins/with-input

Markdown Content:
With-Input plugin

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 1: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Add GraphQL plugin](https://pothos-graphql.dev/docs/plugins/add-graphql)[Complexity plugin](https://pothos-graphql.dev/docs/plugins/complexity)[Dataloader plugin](https://pothos-graphql.dev/docs/plugins/dataloader)[Directive plugin](https://pothos-graphql.dev/docs/plugins/directives)[Drizzle plugin](https://pothos-graphql.dev/docs/plugins/drizzle)[Errors plugin](https://pothos-graphql.dev/docs/plugins/errors)[Federation plugin](https://pothos-graphql.dev/docs/plugins/federation)[Mocks plugin](https://pothos-graphql.dev/docs/plugins/mocks)[Relay plugin](https://pothos-graphql.dev/docs/plugins/relay)[Auth plugin](https://pothos-graphql.dev/docs/plugins/scope-auth)[Simple objects plugin](https://pothos-graphql.dev/docs/plugins/simple-objects)[Smart subscriptions plugin](https://pothos-graphql.dev/docs/plugins/smart-subscriptions)[SubGraph plugin](https://pothos-graphql.dev/docs/plugins/sub-graph)[Tracing plugin](https://pothos-graphql.dev/docs/plugins/tracing)[With-Input plugin](https://pothos-graphql.dev/docs/plugins/with-input)[Zod Validation plugin](https://pothos-graphql.dev/docs/plugins/zod)

[Prisma](https://pothos-graphql.dev/docs/plugins/prisma)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

With-Input plugin Usage

[Plugins](https://pothos-graphql.dev/docs/plugins)

# With-Input plugin

A plugin for creating fields with a single input object. This plugin adds a new `t.fieldWithInput` method that allows you to more easily define fields with a single input type without having to define it separately.

## [Usage](https://pothos-graphql.dev/docs/plugins/with-input#usage)

### [Install](https://pothos-graphql.dev/docs/plugins/with-input#install)

npm pnpm yarn bun

`npm install --save @pothos/plugin-with-input`

### [Setup](https://pothos-graphql.dev/docs/plugins/with-input#setup)

```
import WithInputPlugin from '@pothos/plugin-with-input';
const builder = new SchemaBuilder({
  plugins: [WithInputPlugin],
  // optional
  withInput: {
    typeOptions: {
      // default options for Input object types created by this plugin
    },
    argOptions: {
      // set required: false to override default behavior
    },
  },
});
```

### [Defining fields with inputs](https://pothos-graphql.dev/docs/plugins/with-input#defining-fields-with-inputs)

```
builder.queryType({
  fields: (t) => ({
    example: t.fieldWithInput({
      input: {
        // Note that this uses a new t.input field builder for defining input fields
        id: t.input.id({ required: true }),
      },
      type: 'ID',
      resolve: (root, args) => args.input.id,
    }),
  }),
});
```

This will produce a schema like:

```
type Query {
  example(input: QueryExampleInput!): ID!
}

input QueryExampleInput {
  id: ID!
}
```

The input name will default to `${ParentType.name}${Field.name}Input`.

### [Customizing your input object](https://pothos-graphql.dev/docs/plugins/with-input#customizing-your-input-object)

You can customize the name of your Input object, and the name of the input argument:

```
builder.queryType({
  fields: (t) => ({
    example: t.fieldWithInput({
      typeOptions: {
        name: 'CustomInputTypeName',
        // Additional options for the input type can be added here
      },
      argOptions: {
        name: 'customArgName',
        // Additional options for the input argument can be added here
      },
      input: {
        id: t.input.id({ required: true }),
      },
      type: 'ID',
      // inputs are now under `customArgName`
      resolve: (root, args) => args.customArgName.id,
    }),
  }),
});
```

### [Changing the nullability of the input arg](https://pothos-graphql.dev/docs/plugins/with-input#changing-the-nullability-of-the-input-arg)

You can configure the global default for input args when creating the builder by providing `WithInputArgRequired` in the builders `SchemaTypes`, and setting `withInput.argOptions.required`.

```
const builder = new SchemaBuilder<{ WithInputArgRequired: false }>({
  plugins: [WithInputPlugin],
  withInput: {
    argOptions: {
      required: false,
    },
  },
});
```

arg requiredness can also be set on a per field basis by setting `argOptions.required`

```
builder.queryType({
  fields: (t) => ({
    example: t.fieldWithInput({
      type: 'Boolean',
      argOptions: {
        required: false,
      },
      input: {
        someInput: t.input.boolean({}),
      },
      resolve: (root, args) => {
        return args.input?.someInput;
      },
    }),
});
```

### [Prisma plugin integration](https://pothos-graphql.dev/docs/plugins/with-input#prisma-plugin-integration)

If you are using the prisma plugin you can use `t.prismaFieldWithInput` to add prisma fields with input objects:

```
builder.queryField('user', (t) =>
  t.prismaFieldWithInput({
    type: 'User',
    input: {
      id: t.input.id({ required: true }),
    },
    resolve: (query, _, args) =>
      prisma.user.findUnique({
        where: {
          id: Number.parseInt(args.input.id, 10),
        },
        ...query,
      }),
  }),
);
```

### [Customizing the default naming conventions](https://pothos-graphql.dev/docs/plugins/with-input#customizing-the-default-naming-conventions)

If you want to customize how the default input type names are generated you can provide a name callback in `withInput.typeOptions`:

```
import WithInputPlugin from '@pothos/plugin-with-input';
const builder = new SchemaBuilder({
  plugins: [WithInputPlugin],
  withInput: {
    typeOptions: {
      name: ({ parentTypeName, fieldName }) => {
        const capitalizedFieldName = `${fieldName[0].toUpperCase()}${fieldName.slice(1)}`;
        // This will remove the default Query/Mutation prefix from the input type name
        if (parentTypeName === 'Query' || parentTypeName === 'Mutation') {
          return `${capitalizedFieldName}Input`;
        }

        return `${parentTypeName}${capitalizedFieldName}Input`;
      },
    },
  },
});
```

[Tracing plugin A Pothos plugin for tracing and logging resolver invocations](https://pothos-graphql.dev/docs/plugins/tracing)[Zod Validation plugin Zod plugin docs for Pothos](https://pothos-graphql.dev/docs/plugins/zod)

### On this page

[Usage](https://pothos-graphql.dev/docs/plugins/with-input#usage)[Install](https://pothos-graphql.dev/docs/plugins/with-input#install)[Setup](https://pothos-graphql.dev/docs/plugins/with-input#setup)[Defining fields with inputs](https://pothos-graphql.dev/docs/plugins/with-input#defining-fields-with-inputs)[Customizing your input object](https://pothos-graphql.dev/docs/plugins/with-input#customizing-your-input-object)[Changing the nullability of the input arg](https://pothos-graphql.dev/docs/plugins/with-input#changing-the-nullability-of-the-input-arg)[Prisma plugin integration](https://pothos-graphql.dev/docs/plugins/with-input#prisma-plugin-integration)[Customizing the default naming conventions](https://pothos-graphql.dev/docs/plugins/with-input#customizing-the-default-naming-conventions)

---

## URL: https://pothos-graphql.dev/docs/plugins/with-input#prisma-plugin-integration

Title: With-Input plugin

URL Source: https://pothos-graphql.dev/docs/plugins/with-input

Markdown Content:
With-Input plugin

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 1: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Add GraphQL plugin](https://pothos-graphql.dev/docs/plugins/add-graphql)[Complexity plugin](https://pothos-graphql.dev/docs/plugins/complexity)[Dataloader plugin](https://pothos-graphql.dev/docs/plugins/dataloader)[Directive plugin](https://pothos-graphql.dev/docs/plugins/directives)[Drizzle plugin](https://pothos-graphql.dev/docs/plugins/drizzle)[Errors plugin](https://pothos-graphql.dev/docs/plugins/errors)[Federation plugin](https://pothos-graphql.dev/docs/plugins/federation)[Mocks plugin](https://pothos-graphql.dev/docs/plugins/mocks)[Relay plugin](https://pothos-graphql.dev/docs/plugins/relay)[Auth plugin](https://pothos-graphql.dev/docs/plugins/scope-auth)[Simple objects plugin](https://pothos-graphql.dev/docs/plugins/simple-objects)[Smart subscriptions plugin](https://pothos-graphql.dev/docs/plugins/smart-subscriptions)[SubGraph plugin](https://pothos-graphql.dev/docs/plugins/sub-graph)[Tracing plugin](https://pothos-graphql.dev/docs/plugins/tracing)[With-Input plugin](https://pothos-graphql.dev/docs/plugins/with-input)[Zod Validation plugin](https://pothos-graphql.dev/docs/plugins/zod)

[Prisma](https://pothos-graphql.dev/docs/plugins/prisma)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

With-Input plugin Usage

[Plugins](https://pothos-graphql.dev/docs/plugins)

# With-Input plugin

A plugin for creating fields with a single input object. This plugin adds a new `t.fieldWithInput` method that allows you to more easily define fields with a single input type without having to define it separately.

## [Usage](https://pothos-graphql.dev/docs/plugins/with-input#usage)

### [Install](https://pothos-graphql.dev/docs/plugins/with-input#install)

npm pnpm yarn bun

`npm install --save @pothos/plugin-with-input`

### [Setup](https://pothos-graphql.dev/docs/plugins/with-input#setup)

```
import WithInputPlugin from '@pothos/plugin-with-input';
const builder = new SchemaBuilder({
  plugins: [WithInputPlugin],
  // optional
  withInput: {
    typeOptions: {
      // default options for Input object types created by this plugin
    },
    argOptions: {
      // set required: false to override default behavior
    },
  },
});
```

### [Defining fields with inputs](https://pothos-graphql.dev/docs/plugins/with-input#defining-fields-with-inputs)

```
builder.queryType({
  fields: (t) => ({
    example: t.fieldWithInput({
      input: {
        // Note that this uses a new t.input field builder for defining input fields
        id: t.input.id({ required: true }),
      },
      type: 'ID',
      resolve: (root, args) => args.input.id,
    }),
  }),
});
```

This will produce a schema like:

```
type Query {
  example(input: QueryExampleInput!): ID!
}

input QueryExampleInput {
  id: ID!
}
```

The input name will default to `${ParentType.name}${Field.name}Input`.

### [Customizing your input object](https://pothos-graphql.dev/docs/plugins/with-input#customizing-your-input-object)

You can customize the name of your Input object, and the name of the input argument:

```
builder.queryType({
  fields: (t) => ({
    example: t.fieldWithInput({
      typeOptions: {
        name: 'CustomInputTypeName',
        // Additional options for the input type can be added here
      },
      argOptions: {
        name: 'customArgName',
        // Additional options for the input argument can be added here
      },
      input: {
        id: t.input.id({ required: true }),
      },
      type: 'ID',
      // inputs are now under `customArgName`
      resolve: (root, args) => args.customArgName.id,
    }),
  }),
});
```

### [Changing the nullability of the input arg](https://pothos-graphql.dev/docs/plugins/with-input#changing-the-nullability-of-the-input-arg)

You can configure the global default for input args when creating the builder by providing `WithInputArgRequired` in the builders `SchemaTypes`, and setting `withInput.argOptions.required`.

```
const builder = new SchemaBuilder<{ WithInputArgRequired: false }>({
  plugins: [WithInputPlugin],
  withInput: {
    argOptions: {
      required: false,
    },
  },
});
```

arg requiredness can also be set on a per field basis by setting `argOptions.required`

```
builder.queryType({
  fields: (t) => ({
    example: t.fieldWithInput({
      type: 'Boolean',
      argOptions: {
        required: false,
      },
      input: {
        someInput: t.input.boolean({}),
      },
      resolve: (root, args) => {
        return args.input?.someInput;
      },
    }),
});
```

### [Prisma plugin integration](https://pothos-graphql.dev/docs/plugins/with-input#prisma-plugin-integration)

If you are using the prisma plugin you can use `t.prismaFieldWithInput` to add prisma fields with input objects:

```
builder.queryField('user', (t) =>
  t.prismaFieldWithInput({
    type: 'User',
    input: {
      id: t.input.id({ required: true }),
    },
    resolve: (query, _, args) =>
      prisma.user.findUnique({
        where: {
          id: Number.parseInt(args.input.id, 10),
        },
        ...query,
      }),
  }),
);
```

### [Customizing the default naming conventions](https://pothos-graphql.dev/docs/plugins/with-input#customizing-the-default-naming-conventions)

If you want to customize how the default input type names are generated you can provide a name callback in `withInput.typeOptions`:

```
import WithInputPlugin from '@pothos/plugin-with-input';
const builder = new SchemaBuilder({
  plugins: [WithInputPlugin],
  withInput: {
    typeOptions: {
      name: ({ parentTypeName, fieldName }) => {
        const capitalizedFieldName = `${fieldName[0].toUpperCase()}${fieldName.slice(1)}`;
        // This will remove the default Query/Mutation prefix from the input type name
        if (parentTypeName === 'Query' || parentTypeName === 'Mutation') {
          return `${capitalizedFieldName}Input`;
        }

        return `${parentTypeName}${capitalizedFieldName}Input`;
      },
    },
  },
});
```

[Tracing plugin A Pothos plugin for tracing and logging resolver invocations](https://pothos-graphql.dev/docs/plugins/tracing)[Zod Validation plugin Zod plugin docs for Pothos](https://pothos-graphql.dev/docs/plugins/zod)

### On this page

[Usage](https://pothos-graphql.dev/docs/plugins/with-input#usage)[Install](https://pothos-graphql.dev/docs/plugins/with-input#install)[Setup](https://pothos-graphql.dev/docs/plugins/with-input#setup)[Defining fields with inputs](https://pothos-graphql.dev/docs/plugins/with-input#defining-fields-with-inputs)[Customizing your input object](https://pothos-graphql.dev/docs/plugins/with-input#customizing-your-input-object)[Changing the nullability of the input arg](https://pothos-graphql.dev/docs/plugins/with-input#changing-the-nullability-of-the-input-arg)[Prisma plugin integration](https://pothos-graphql.dev/docs/plugins/with-input#prisma-plugin-integration)[Customizing the default naming conventions](https://pothos-graphql.dev/docs/plugins/with-input#customizing-the-default-naming-conventions)

---

## URL: https://pothos-graphql.dev/docs/plugins/zod#validating-list

Title: Zod Validation plugin

URL Source: https://pothos-graphql.dev/docs/plugins/zod

Markdown Content:
A plugin for adding validation for field arguments based on [zod](https://github.com/colinhacks/zod). This plugin does not expose zod directly, but most of the options map closely to the validations available in zod.

### [Install](https://pothos-graphql.dev/docs/plugins/zod#install)

To use the zod plugin you will need to install both `zod` package and the zod plugin:

### [Setup](https://pothos-graphql.dev/docs/plugins/zod#setup)

`validationError`: (optional) A function that will be called when validation fails. The function will be passed the the zod validation error, as well as the args, context and info objects. It can throw an error, or return an error message or custom Error instance.

### [Examples](https://pothos-graphql.dev/docs/plugins/zod#examples)

#### [With custom message](https://pothos-graphql.dev/docs/plugins/zod#with-custom-message)

### [Validating List](https://pothos-graphql.dev/docs/plugins/zod#validating-list)

### [Using your own zod schemas](https://pothos-graphql.dev/docs/plugins/zod#using-your-own-zod-schemas)

If you just want to use a zod schema defined somewhere else, rather than using the validation options you can use the `schema` option:

You can also validate all arguments together using a zod schema:

### [On Object fields (for validating field arguments)](https://pothos-graphql.dev/docs/plugins/zod#on-object-fields-for-validating-field-arguments)

- `validate`: `Refinement<T>` | `Refinement<T>[]` | `ValidationOptions`.

### [On InputObjects (for validating all fields of an input object)](https://pothos-graphql.dev/docs/plugins/zod#on-inputobjects-for-validating-all-fields-of-an-input-object)

- `validate`: `Refinement<T>` | `Refinement<T>[]` | `ValidationOptions`.

### [On arguments or input object fields (for validating a specific input field or argument)](https://pothos-graphql.dev/docs/plugins/zod#on-arguments-or-input-object-fields-for-validating-a-specific-input-field-or-argument)

- `validate`: `Refinement<T>` | `Refinement<T>[]` | `ValidationOptions`.

### [`Refinement`](https://pothos-graphql.dev/docs/plugins/zod#refinement)

A `Refinement` is a function that will be passed to the ` zod``refine ` method. It receives the args object, input object, or value of the specific field the refinement is defined on. It should return a `boolean` or `Promise<boolean>`.

`Refinement`s can either be just a function: `(val) => isValid(val)`, or an array with the function, and an options object like: `[(val) => isValid(val), { message: 'field should be valid' }]`.

The options object may have a `message` property, and if the type being validated is an object, it can also include a `path` property with an array of strings indicating the path of the field in the object being validated. See the zod docs on `refine` for more details.

### [`ValidationOptions`](https://pothos-graphql.dev/docs/plugins/zod#validationoptions)

The validation options available depend on the type being validated. Each property of `ValidationOptions` can either be a value specific to the constraint, or an array with the value, and the options passed to the underlying zod method. This options object can be used to set a custom error message:

#### [Number](https://pothos-graphql.dev/docs/plugins/zod#number)

- `type`?: `'number'`
- `refine`?: `Refinement<number> | Refinement<number>[]`
- `min`?: `Constraint<number>`
- `max`?: `Constraint<number>`
- `positive`?: `Constraint<boolean>`
- `nonnegative`?: `Constraint<boolean>`
- `negative`?: `Constraint<boolean>`
- `nonpositive`?: `Constraint<boolean>`
- `int`?: `Constraint<boolean>`
- `schema`?: `ZodSchema<number>`

#### [BigInt](https://pothos-graphql.dev/docs/plugins/zod#bigint)

- `type`?: `'bigint'`
- `refine`?: `Refinement<bigint> | Refinement<bigint>[]`
- `schema`?: `ZodSchema<bigint>`

#### [Boolean](https://pothos-graphql.dev/docs/plugins/zod#boolean)

- `type`?: `'boolean'`
- `refine`?: `Refinement<boolean> | Refinement<boolean>[]`
- `schema`?: `ZodSchema<boolean>`

#### [Date](https://pothos-graphql.dev/docs/plugins/zod#date)

- `type`?: `'boolean'`
- `refine`?: `Refinement<boolean> | Refinement<boolean>[]`
- `schema`?: `ZodSchema<Date>`

#### [String](https://pothos-graphql.dev/docs/plugins/zod#string)

- `type`?: `'string'`;
- `refine`?: `Refinement<string> | Refinement<string>[]`
- `minLength`?: `Constraint<number>`
- `maxLength`?: `Constraint<number>`
- `length`?: `Constraint<number>`
- `url`?: `Constraint<boolean>`
- `uuid`?: `Constraint<boolean>`
- `email`?: `Constraint<boolean>`
- `regex`?: `Constraint<RegExp>`
- `schema`?: `ZodSchema<string>`

#### [Object](https://pothos-graphql.dev/docs/plugins/zod#object)

- `type`?: `'object'`;
- `refine`?: `Refinement<T> | Refinement<T>[]`
- `schema`?: `ZodSchema<Ts>`

#### [Array](https://pothos-graphql.dev/docs/plugins/zod#array)

- `type`?: `'array'`;
- `refine`?: `Refinement<T[]> | Refinement<T[]>[]`
- `minLength`?: `Constraint<number>`
- `maxLength`?: `Constraint<number>`
- `length`?: `Constraint<number>`
- `items`?: `ValidationOptions<T> | Refinement<T>`
- `schema`?: `ZodSchema<T[]>`

### [How it works](https://pothos-graphql.dev/docs/plugins/zod#how-it-works)

Each arg on an object field, and each field on an input type with validation will build its own zod validator. These validators will be a union of all potential types that can apply the validations defined for that field. For example, if you define an optional field with a `maxLength` validator, it will create a zod schema that looks something like:

If you set and `email` validation instead the schema might look like:

At runtime, we don't know anything about the types being used by your schema, we can't infer the expected js type from the type definition, so the best we can do is limit the valid types based on what validations they support. The `type` validation allows explicitly validating the `type` of a field to be one of the base types supported by zod:

There are a few exceptions the above:

1.  args and input fields that are `InputObject`s always use `zod.object()` rather than creating a union of potential types.

2.  args and input fields that are list types always use `zod.array()`.

3.  If you only include a `refine` validation (or just pass a function directly to validate) we will just use `zod`s unknown validator instead:

If the validation options include a `schema` that schema will be used as an intersection wit the generated validator:

### [Sharing schemas with client code](https://pothos-graphql.dev/docs/plugins/zod#sharing-schemas-with-client-code)

The easiest way to share validators is the use the to define schemas for your fields in an external file using the normal zod APIs, and then attaching those to your fields using the `schema` option.

You can also use the `createZodSchema` helper from the plugin directly to create zod Schemas from an options object:

---

## URL: https://pothos-graphql.dev/docs/plugins/zod#validationoptions

Title: Zod Validation plugin

URL Source: https://pothos-graphql.dev/docs/plugins/zod

Markdown Content:
A plugin for adding validation for field arguments based on [zod](https://github.com/colinhacks/zod). This plugin does not expose zod directly, but most of the options map closely to the validations available in zod.

### [Install](https://pothos-graphql.dev/docs/plugins/zod#install)

To use the zod plugin you will need to install both `zod` package and the zod plugin:

### [Setup](https://pothos-graphql.dev/docs/plugins/zod#setup)

`validationError`: (optional) A function that will be called when validation fails. The function will be passed the the zod validation error, as well as the args, context and info objects. It can throw an error, or return an error message or custom Error instance.

### [Examples](https://pothos-graphql.dev/docs/plugins/zod#examples)

#### [With custom message](https://pothos-graphql.dev/docs/plugins/zod#with-custom-message)

### [Validating List](https://pothos-graphql.dev/docs/plugins/zod#validating-list)

### [Using your own zod schemas](https://pothos-graphql.dev/docs/plugins/zod#using-your-own-zod-schemas)

If you just want to use a zod schema defined somewhere else, rather than using the validation options you can use the `schema` option:

You can also validate all arguments together using a zod schema:

### [On Object fields (for validating field arguments)](https://pothos-graphql.dev/docs/plugins/zod#on-object-fields-for-validating-field-arguments)

- `validate`: `Refinement<T>` | `Refinement<T>[]` | `ValidationOptions`.

### [On InputObjects (for validating all fields of an input object)](https://pothos-graphql.dev/docs/plugins/zod#on-inputobjects-for-validating-all-fields-of-an-input-object)

- `validate`: `Refinement<T>` | `Refinement<T>[]` | `ValidationOptions`.

### [On arguments or input object fields (for validating a specific input field or argument)](https://pothos-graphql.dev/docs/plugins/zod#on-arguments-or-input-object-fields-for-validating-a-specific-input-field-or-argument)

- `validate`: `Refinement<T>` | `Refinement<T>[]` | `ValidationOptions`.

### [`Refinement`](https://pothos-graphql.dev/docs/plugins/zod#refinement)

A `Refinement` is a function that will be passed to the ` zod``refine ` method. It receives the args object, input object, or value of the specific field the refinement is defined on. It should return a `boolean` or `Promise<boolean>`.

`Refinement`s can either be just a function: `(val) => isValid(val)`, or an array with the function, and an options object like: `[(val) => isValid(val), { message: 'field should be valid' }]`.

The options object may have a `message` property, and if the type being validated is an object, it can also include a `path` property with an array of strings indicating the path of the field in the object being validated. See the zod docs on `refine` for more details.

### [`ValidationOptions`](https://pothos-graphql.dev/docs/plugins/zod#validationoptions)

The validation options available depend on the type being validated. Each property of `ValidationOptions` can either be a value specific to the constraint, or an array with the value, and the options passed to the underlying zod method. This options object can be used to set a custom error message:

#### [Number](https://pothos-graphql.dev/docs/plugins/zod#number)

- `type`?: `'number'`
- `refine`?: `Refinement<number> | Refinement<number>[]`
- `min`?: `Constraint<number>`
- `max`?: `Constraint<number>`
- `positive`?: `Constraint<boolean>`
- `nonnegative`?: `Constraint<boolean>`
- `negative`?: `Constraint<boolean>`
- `nonpositive`?: `Constraint<boolean>`
- `int`?: `Constraint<boolean>`
- `schema`?: `ZodSchema<number>`

#### [BigInt](https://pothos-graphql.dev/docs/plugins/zod#bigint)

- `type`?: `'bigint'`
- `refine`?: `Refinement<bigint> | Refinement<bigint>[]`
- `schema`?: `ZodSchema<bigint>`

#### [Boolean](https://pothos-graphql.dev/docs/plugins/zod#boolean)

- `type`?: `'boolean'`
- `refine`?: `Refinement<boolean> | Refinement<boolean>[]`
- `schema`?: `ZodSchema<boolean>`

#### [Date](https://pothos-graphql.dev/docs/plugins/zod#date)

- `type`?: `'boolean'`
- `refine`?: `Refinement<boolean> | Refinement<boolean>[]`
- `schema`?: `ZodSchema<Date>`

#### [String](https://pothos-graphql.dev/docs/plugins/zod#string)

- `type`?: `'string'`;
- `refine`?: `Refinement<string> | Refinement<string>[]`
- `minLength`?: `Constraint<number>`
- `maxLength`?: `Constraint<number>`
- `length`?: `Constraint<number>`
- `url`?: `Constraint<boolean>`
- `uuid`?: `Constraint<boolean>`
- `email`?: `Constraint<boolean>`
- `regex`?: `Constraint<RegExp>`
- `schema`?: `ZodSchema<string>`

#### [Object](https://pothos-graphql.dev/docs/plugins/zod#object)

- `type`?: `'object'`;
- `refine`?: `Refinement<T> | Refinement<T>[]`
- `schema`?: `ZodSchema<Ts>`

#### [Array](https://pothos-graphql.dev/docs/plugins/zod#array)

- `type`?: `'array'`;
- `refine`?: `Refinement<T[]> | Refinement<T[]>[]`
- `minLength`?: `Constraint<number>`
- `maxLength`?: `Constraint<number>`
- `length`?: `Constraint<number>`
- `items`?: `ValidationOptions<T> | Refinement<T>`
- `schema`?: `ZodSchema<T[]>`

### [How it works](https://pothos-graphql.dev/docs/plugins/zod#how-it-works)

Each arg on an object field, and each field on an input type with validation will build its own zod validator. These validators will be a union of all potential types that can apply the validations defined for that field. For example, if you define an optional field with a `maxLength` validator, it will create a zod schema that looks something like:

If you set and `email` validation instead the schema might look like:

At runtime, we don't know anything about the types being used by your schema, we can't infer the expected js type from the type definition, so the best we can do is limit the valid types based on what validations they support. The `type` validation allows explicitly validating the `type` of a field to be one of the base types supported by zod:

There are a few exceptions the above:

1.  args and input fields that are `InputObject`s always use `zod.object()` rather than creating a union of potential types.

2.  args and input fields that are list types always use `zod.array()`.

3.  If you only include a `refine` validation (or just pass a function directly to validate) we will just use `zod`s unknown validator instead:

If the validation options include a `schema` that schema will be used as an intersection wit the generated validator:

### [Sharing schemas with client code](https://pothos-graphql.dev/docs/plugins/zod#sharing-schemas-with-client-code)

The easiest way to share validators is the use the to define schemas for your fields in an external file using the normal zod APIs, and then attaching those to your fields using the `schema` option.

You can also use the `createZodSchema` helper from the plugin directly to create zod Schemas from an options object:

---

## URL: https://pothos-graphql.dev/docs/plugins/zod#how-it-works

Title: Zod Validation plugin

URL Source: https://pothos-graphql.dev/docs/plugins/zod

Markdown Content:
A plugin for adding validation for field arguments based on [zod](https://github.com/colinhacks/zod). This plugin does not expose zod directly, but most of the options map closely to the validations available in zod.

### [Install](https://pothos-graphql.dev/docs/plugins/zod#install)

To use the zod plugin you will need to install both `zod` package and the zod plugin:

### [Setup](https://pothos-graphql.dev/docs/plugins/zod#setup)

`validationError`: (optional) A function that will be called when validation fails. The function will be passed the the zod validation error, as well as the args, context and info objects. It can throw an error, or return an error message or custom Error instance.

### [Examples](https://pothos-graphql.dev/docs/plugins/zod#examples)

#### [With custom message](https://pothos-graphql.dev/docs/plugins/zod#with-custom-message)

### [Validating List](https://pothos-graphql.dev/docs/plugins/zod#validating-list)

### [Using your own zod schemas](https://pothos-graphql.dev/docs/plugins/zod#using-your-own-zod-schemas)

If you just want to use a zod schema defined somewhere else, rather than using the validation options you can use the `schema` option:

You can also validate all arguments together using a zod schema:

### [On Object fields (for validating field arguments)](https://pothos-graphql.dev/docs/plugins/zod#on-object-fields-for-validating-field-arguments)

- `validate`: `Refinement<T>` | `Refinement<T>[]` | `ValidationOptions`.

### [On InputObjects (for validating all fields of an input object)](https://pothos-graphql.dev/docs/plugins/zod#on-inputobjects-for-validating-all-fields-of-an-input-object)

- `validate`: `Refinement<T>` | `Refinement<T>[]` | `ValidationOptions`.

### [On arguments or input object fields (for validating a specific input field or argument)](https://pothos-graphql.dev/docs/plugins/zod#on-arguments-or-input-object-fields-for-validating-a-specific-input-field-or-argument)

- `validate`: `Refinement<T>` | `Refinement<T>[]` | `ValidationOptions`.

### [`Refinement`](https://pothos-graphql.dev/docs/plugins/zod#refinement)

A `Refinement` is a function that will be passed to the ` zod``refine ` method. It receives the args object, input object, or value of the specific field the refinement is defined on. It should return a `boolean` or `Promise<boolean>`.

`Refinement`s can either be just a function: `(val) => isValid(val)`, or an array with the function, and an options object like: `[(val) => isValid(val), { message: 'field should be valid' }]`.

The options object may have a `message` property, and if the type being validated is an object, it can also include a `path` property with an array of strings indicating the path of the field in the object being validated. See the zod docs on `refine` for more details.

### [`ValidationOptions`](https://pothos-graphql.dev/docs/plugins/zod#validationoptions)

The validation options available depend on the type being validated. Each property of `ValidationOptions` can either be a value specific to the constraint, or an array with the value, and the options passed to the underlying zod method. This options object can be used to set a custom error message:

#### [Number](https://pothos-graphql.dev/docs/plugins/zod#number)

- `type`?: `'number'`
- `refine`?: `Refinement<number> | Refinement<number>[]`
- `min`?: `Constraint<number>`
- `max`?: `Constraint<number>`
- `positive`?: `Constraint<boolean>`
- `nonnegative`?: `Constraint<boolean>`
- `negative`?: `Constraint<boolean>`
- `nonpositive`?: `Constraint<boolean>`
- `int`?: `Constraint<boolean>`
- `schema`?: `ZodSchema<number>`

#### [BigInt](https://pothos-graphql.dev/docs/plugins/zod#bigint)

- `type`?: `'bigint'`
- `refine`?: `Refinement<bigint> | Refinement<bigint>[]`
- `schema`?: `ZodSchema<bigint>`

#### [Boolean](https://pothos-graphql.dev/docs/plugins/zod#boolean)

- `type`?: `'boolean'`
- `refine`?: `Refinement<boolean> | Refinement<boolean>[]`
- `schema`?: `ZodSchema<boolean>`

#### [Date](https://pothos-graphql.dev/docs/plugins/zod#date)

- `type`?: `'boolean'`
- `refine`?: `Refinement<boolean> | Refinement<boolean>[]`
- `schema`?: `ZodSchema<Date>`

#### [String](https://pothos-graphql.dev/docs/plugins/zod#string)

- `type`?: `'string'`;
- `refine`?: `Refinement<string> | Refinement<string>[]`
- `minLength`?: `Constraint<number>`
- `maxLength`?: `Constraint<number>`
- `length`?: `Constraint<number>`
- `url`?: `Constraint<boolean>`
- `uuid`?: `Constraint<boolean>`
- `email`?: `Constraint<boolean>`
- `regex`?: `Constraint<RegExp>`
- `schema`?: `ZodSchema<string>`

#### [Object](https://pothos-graphql.dev/docs/plugins/zod#object)

- `type`?: `'object'`;
- `refine`?: `Refinement<T> | Refinement<T>[]`
- `schema`?: `ZodSchema<Ts>`

#### [Array](https://pothos-graphql.dev/docs/plugins/zod#array)

- `type`?: `'array'`;
- `refine`?: `Refinement<T[]> | Refinement<T[]>[]`
- `minLength`?: `Constraint<number>`
- `maxLength`?: `Constraint<number>`
- `length`?: `Constraint<number>`
- `items`?: `ValidationOptions<T> | Refinement<T>`
- `schema`?: `ZodSchema<T[]>`

### [How it works](https://pothos-graphql.dev/docs/plugins/zod#how-it-works)

Each arg on an object field, and each field on an input type with validation will build its own zod validator. These validators will be a union of all potential types that can apply the validations defined for that field. For example, if you define an optional field with a `maxLength` validator, it will create a zod schema that looks something like:

If you set and `email` validation instead the schema might look like:

At runtime, we don't know anything about the types being used by your schema, we can't infer the expected js type from the type definition, so the best we can do is limit the valid types based on what validations they support. The `type` validation allows explicitly validating the `type` of a field to be one of the base types supported by zod:

There are a few exceptions the above:

1.  args and input fields that are `InputObject`s always use `zod.object()` rather than creating a union of potential types.

2.  args and input fields that are list types always use `zod.array()`.

3.  If you only include a `refine` validation (or just pass a function directly to validate) we will just use `zod`s unknown validator instead:

If the validation options include a `schema` that schema will be used as an intersection wit the generated validator:

### [Sharing schemas with client code](https://pothos-graphql.dev/docs/plugins/zod#sharing-schemas-with-client-code)

The easiest way to share validators is the use the to define schemas for your fields in an external file using the normal zod APIs, and then attaching those to your fields using the `schema` option.

You can also use the `createZodSchema` helper from the plugin directly to create zod Schemas from an options object:

---

## URL: https://pothos-graphql.dev/docs/plugins/zod#sharing-schemas-with-client-code

Title: Zod Validation plugin

URL Source: https://pothos-graphql.dev/docs/plugins/zod

Markdown Content:
A plugin for adding validation for field arguments based on [zod](https://github.com/colinhacks/zod). This plugin does not expose zod directly, but most of the options map closely to the validations available in zod.

### [Install](https://pothos-graphql.dev/docs/plugins/zod#install)

To use the zod plugin you will need to install both `zod` package and the zod plugin:

### [Setup](https://pothos-graphql.dev/docs/plugins/zod#setup)

`validationError`: (optional) A function that will be called when validation fails. The function will be passed the the zod validation error, as well as the args, context and info objects. It can throw an error, or return an error message or custom Error instance.

### [Examples](https://pothos-graphql.dev/docs/plugins/zod#examples)

#### [With custom message](https://pothos-graphql.dev/docs/plugins/zod#with-custom-message)

### [Validating List](https://pothos-graphql.dev/docs/plugins/zod#validating-list)

### [Using your own zod schemas](https://pothos-graphql.dev/docs/plugins/zod#using-your-own-zod-schemas)

If you just want to use a zod schema defined somewhere else, rather than using the validation options you can use the `schema` option:

You can also validate all arguments together using a zod schema:

### [On Object fields (for validating field arguments)](https://pothos-graphql.dev/docs/plugins/zod#on-object-fields-for-validating-field-arguments)

- `validate`: `Refinement<T>` | `Refinement<T>[]` | `ValidationOptions`.

### [On InputObjects (for validating all fields of an input object)](https://pothos-graphql.dev/docs/plugins/zod#on-inputobjects-for-validating-all-fields-of-an-input-object)

- `validate`: `Refinement<T>` | `Refinement<T>[]` | `ValidationOptions`.

### [On arguments or input object fields (for validating a specific input field or argument)](https://pothos-graphql.dev/docs/plugins/zod#on-arguments-or-input-object-fields-for-validating-a-specific-input-field-or-argument)

- `validate`: `Refinement<T>` | `Refinement<T>[]` | `ValidationOptions`.

### [`Refinement`](https://pothos-graphql.dev/docs/plugins/zod#refinement)

A `Refinement` is a function that will be passed to the ` zod``refine ` method. It receives the args object, input object, or value of the specific field the refinement is defined on. It should return a `boolean` or `Promise<boolean>`.

`Refinement`s can either be just a function: `(val) => isValid(val)`, or an array with the function, and an options object like: `[(val) => isValid(val), { message: 'field should be valid' }]`.

The options object may have a `message` property, and if the type being validated is an object, it can also include a `path` property with an array of strings indicating the path of the field in the object being validated. See the zod docs on `refine` for more details.

### [`ValidationOptions`](https://pothos-graphql.dev/docs/plugins/zod#validationoptions)

The validation options available depend on the type being validated. Each property of `ValidationOptions` can either be a value specific to the constraint, or an array with the value, and the options passed to the underlying zod method. This options object can be used to set a custom error message:

#### [Number](https://pothos-graphql.dev/docs/plugins/zod#number)

- `type`?: `'number'`
- `refine`?: `Refinement<number> | Refinement<number>[]`
- `min`?: `Constraint<number>`
- `max`?: `Constraint<number>`
- `positive`?: `Constraint<boolean>`
- `nonnegative`?: `Constraint<boolean>`
- `negative`?: `Constraint<boolean>`
- `nonpositive`?: `Constraint<boolean>`
- `int`?: `Constraint<boolean>`
- `schema`?: `ZodSchema<number>`

#### [BigInt](https://pothos-graphql.dev/docs/plugins/zod#bigint)

- `type`?: `'bigint'`
- `refine`?: `Refinement<bigint> | Refinement<bigint>[]`
- `schema`?: `ZodSchema<bigint>`

#### [Boolean](https://pothos-graphql.dev/docs/plugins/zod#boolean)

- `type`?: `'boolean'`
- `refine`?: `Refinement<boolean> | Refinement<boolean>[]`
- `schema`?: `ZodSchema<boolean>`

#### [Date](https://pothos-graphql.dev/docs/plugins/zod#date)

- `type`?: `'boolean'`
- `refine`?: `Refinement<boolean> | Refinement<boolean>[]`
- `schema`?: `ZodSchema<Date>`

#### [String](https://pothos-graphql.dev/docs/plugins/zod#string)

- `type`?: `'string'`;
- `refine`?: `Refinement<string> | Refinement<string>[]`
- `minLength`?: `Constraint<number>`
- `maxLength`?: `Constraint<number>`
- `length`?: `Constraint<number>`
- `url`?: `Constraint<boolean>`
- `uuid`?: `Constraint<boolean>`
- `email`?: `Constraint<boolean>`
- `regex`?: `Constraint<RegExp>`
- `schema`?: `ZodSchema<string>`

#### [Object](https://pothos-graphql.dev/docs/plugins/zod#object)

- `type`?: `'object'`;
- `refine`?: `Refinement<T> | Refinement<T>[]`
- `schema`?: `ZodSchema<Ts>`

#### [Array](https://pothos-graphql.dev/docs/plugins/zod#array)

- `type`?: `'array'`;
- `refine`?: `Refinement<T[]> | Refinement<T[]>[]`
- `minLength`?: `Constraint<number>`
- `maxLength`?: `Constraint<number>`
- `length`?: `Constraint<number>`
- `items`?: `ValidationOptions<T> | Refinement<T>`
- `schema`?: `ZodSchema<T[]>`

### [How it works](https://pothos-graphql.dev/docs/plugins/zod#how-it-works)

Each arg on an object field, and each field on an input type with validation will build its own zod validator. These validators will be a union of all potential types that can apply the validations defined for that field. For example, if you define an optional field with a `maxLength` validator, it will create a zod schema that looks something like:

If you set and `email` validation instead the schema might look like:

At runtime, we don't know anything about the types being used by your schema, we can't infer the expected js type from the type definition, so the best we can do is limit the valid types based on what validations they support. The `type` validation allows explicitly validating the `type` of a field to be one of the base types supported by zod:

There are a few exceptions the above:

1.  args and input fields that are `InputObject`s always use `zod.object()` rather than creating a union of potential types.

2.  args and input fields that are list types always use `zod.array()`.

3.  If you only include a `refine` validation (or just pass a function directly to validate) we will just use `zod`s unknown validator instead:

If the validation options include a `schema` that schema will be used as an intersection wit the generated validator:

### [Sharing schemas with client code](https://pothos-graphql.dev/docs/plugins/zod#sharing-schemas-with-client-code)

The easiest way to share validators is the use the to define schemas for your fields in an external file using the normal zod APIs, and then attaching those to your fields using the `schema` option.

You can also use the `createZodSchema` helper from the plugin directly to create zod Schemas from an options object:

---

## URL: https://pothos-graphql.dev/docs/api/field-builder

Title: FieldBuilder

URL Source: https://pothos-graphql.dev/docs/api/field-builder

Markdown Content:
Api

- `options`: `FieldOptions`

### [FieldOptions](https://pothos-graphql.dev/docs/api/field-builder#fieldoptions-1)

- `type`: [Type Parameter](https://pothos-graphql.dev/docs/api/field-builder#type-parameter)

- `args`: a map of arg name to arg values. Arg values can be created using an [`InputFieldBuilder`](https://pothos-graphql.dev/docs/api/input-field-builder)

(`fieldBuilder.arg`) or using `schemaBuilder.args`

- `nullable`: boolean, defaults to `true`, unless overwritten in SchemaBuilder see [Changing Default Nullability](https://pothos-graphql.dev/docs/guide/changing-default-nullability).

- `description`: string

- `deprecationReason`: string

- `resolve`: [Resolver](https://pothos-graphql.dev/docs/api/field-builder#resolver)

### [Type Parameter](https://pothos-graphql.dev/docs/api/field-builder#type-parameter)

A Type Parameter for a Field can be any `TypeRef` returned by one of the [`SchemaBuilder`](https://pothos-graphql.dev/docs/api/schema-builder) methods for defining a type, a class used to create an object or interface type, a ts enum used to define a graphql enum type, or a string that corresponds to one of they keys of the `Objects`, `Interfaces`, or `Scalars` objects defined in `SchemaTypes`.

For List fields, the Type Parameter should be one of the above wrapped in an array eg `['User']`.

### [Resolver](https://pothos-graphql.dev/docs/api/field-builder#resolver)

A function to resolve the value of this field.

#### [Return type](https://pothos-graphql.dev/docs/api/field-builder#return-type)

Field resolvers should return a value (or promise) that matches the expected type for this field. For `Scalars`, `Objects`, and `Interfaces` this type is the corresponding type defined `SchemaTypes`. For Unions, the type may be any of the corresponding shapes of members of the union. For Enums, the value is dependent on the implementation of the enum. See `Enum` guide for more details.

#### [Args](https://pothos-graphql.dev/docs/api/field-builder#args)

- `parent`: Parent will be a value of the backing model for the current type specified in

`SchemaTypes`.

- `args`: an object matching the shape of the args option for the current field

- `context`: The type `Context` type defined in `SchemaTypes`.

- `info`: a GraphQLResolveInfo object see

[https://graphql.org/graphql-js/type/#graphqlobjecttype](https://graphql.org/graphql-js/type/#graphqlobjecttype)

for more details.

A set of helpers for creating scalar fields. This work the same as [`field`](https://pothos-graphql.dev/docs/api/field-builder#fieldoptions), but omit the `type` field from options.

### [Scalars](https://pothos-graphql.dev/docs/api/field-builder#scalars)

- `string(options)`
- `id(options)`
- `boolean(options)`
- `int(options)`
- `float(options)`
- `stringList(options)`
- `idList(options)`
- `booleanList(options)`
- `intList(options)`
- `floatList(options)`
- `listRef(type, options)`

### [expose](https://pothos-graphql.dev/docs/api/field-builder#expose)

A set of helpers to expose fields from the backing model. The `name` arg can be any field from the backing model that matches the type being exposed. Options are the same as [`field`](https://pothos-graphql.dev/docs/api/field-builder#fieldoptions), but `type` and `resolve` are omitted.

- `exposeString(name, options)`
- `exposeID(name, options)`
- `exposeBoolean(name, options)`
- `exposeInt(name, options)`
- `exposeFloat(name, options)`
- `exposeStringList(name, options)`
- `exposeIDList(name, options)`
- `exposeBooleanList(name, options)`
- `exposeIntList(name, options)`
- `exposeFloatList(name, options)`

---

## URL: https://pothos-graphql.dev/docs/guide/interfaces#implementing-interfaces-with-object-types

Title: Interfaces

URL Source: https://pothos-graphql.dev/docs/guide/interfaces

Markdown Content:
Interfaces

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 1: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Objects](https://pothos-graphql.dev/docs/guide/objects)[Queries, Mutations and Subscriptions](https://pothos-graphql.dev/docs/guide/queries-mutations-and-subscriptions)[SchemaBuilder](https://pothos-graphql.dev/docs/guide/schema-builder)[Fields](https://pothos-graphql.dev/docs/guide/fields)[Using args](https://pothos-graphql.dev/docs/guide/args)[Using Context](https://pothos-graphql.dev/docs/guide/context)[Input Objects](https://pothos-graphql.dev/docs/guide/inputs)[Enums](https://pothos-graphql.dev/docs/guide/enums)[Scalars](https://pothos-graphql.dev/docs/guide/scalars)[Interfaces](https://pothos-graphql.dev/docs/guide/interfaces)[Unions](https://pothos-graphql.dev/docs/guide/unions)[Using plugins](https://pothos-graphql.dev/docs/guide/using-plugins)[Inferring Types](https://pothos-graphql.dev/docs/guide/inferring-types)[File layout](https://pothos-graphql.dev/docs/guide/app-layout)[Generating client types](https://pothos-graphql.dev/docs/guide/generating-client-types)[Patterns](https://pothos-graphql.dev/docs/guide/patterns)[Printing Schemas](https://pothos-graphql.dev/docs/guide/printing-schemas)[Default nullability](https://pothos-graphql.dev/docs/guide/changing-default-nullability)[Writing plugins](https://pothos-graphql.dev/docs/guide/writing-plugins)[Using Deno](https://pothos-graphql.dev/docs/guide/deno)[Circular References](https://pothos-graphql.dev/docs/guide/circular-references)[Troubleshooting](https://pothos-graphql.dev/docs/guide/troubleshooting)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

Interfaces Defining Interface Types

[Guide](https://pothos-graphql.dev/docs/guide)

# Interfaces

## [Defining Interface Types](https://pothos-graphql.dev/docs/guide/interfaces#defining-interface-types)

Defining interfaces works exactly like [defining Objects](https://pothos-graphql.dev/docs/guide/objects), using `Interfaces` key in SchemaTypes object for the builder, and `interfaceRef` rather than `objectRef`.

In this example we'll use an Animal class and a Giraffe class that extends it:

```
export class Animal {
  diet: Diet;

  constructor(diet: Diet) {
    this.diet = diet;
  }
}

export class Giraffe extends Animal {
  name: string;
  birthday: Date;
  heightInMeters: number;

  constructor(name: string, birthday: Date, heightInMeters: number) {
    super(Diet.HERBIVOROUS);

    this.name = name;
    this.birthday = birthday;
    this.heightInMeters = heightInMeters;
  }
}
export enum Diet {
  HERBIVOROUS,
  CARNIVOROUS,
  OMNIVORIOUS,
}
```

Again, using classes is completely optional. The only requirement for interfaces is that the the type used for defining objects must be a superset of the the types of any interfaces they implement.

Now that we have our classes set up we can define the interface type. and add a enum definitions for our diet field:

```
builder.interfaceType(Animal, {
  name: 'AnimalFromClass',
  fields: (t) => ({
    diet: t.expose('diet', {
      type: Diet,
    }),
  }),
});

builder.enumType(Diet, {
  name: 'Diet',
});
```

## [implementing interfaces with object types](https://pothos-graphql.dev/docs/guide/interfaces#implementing-interfaces-with-object-types)

```
builder.objectType(Giraffe, {
  name: 'Giraffe',
  interfaces: [Animal],
  isTypeOf: (value) => value instanceof Giraffe,
  fields: (t) => ({
    name: t.exposeString('name', {}),
  }),
});
```

There are 2 new properties here: `interfaces` and `isTypeOf`.

Interfaces is an array of interfaces that the object type implements, and `isTypeOf` is a function that is run whenever we have an object of the interface type and we want to see if it's actually an instance of our object type.

## [Using an Interface as a return type](https://pothos-graphql.dev/docs/guide/interfaces#using-an-interface-as-a-return-type)

Using interfaces as return types for fields works just like objects:

```
builder.queryFields((t) => ({
  animal: t.field({
    type: 'Animal',
    resolve: () => new Giraffe('James', new Date(Date.UTC(2012, 11, 12)), 5.2),
  }),
}));
```

## [Querying interface fields](https://pothos-graphql.dev/docs/guide/interfaces#querying-interface-fields)

We can query interface fields like diet on any field that returns a giraffe:

```
query {
  giraffe {
    name
    diet
  }
}
```

or we can query a field that returns an interface and select different fields depending on the concrete type:

```
query {
  animal {
    diet
    ... on Giraffe {
      name
    }
  }
}
```

[Scalars Guide for defining Scalar types in Pothos](https://pothos-graphql.dev/docs/guide/scalars)[Unions Guide for defining Union types in Pothos](https://pothos-graphql.dev/docs/guide/unions)

### On this page

[Defining Interface Types](https://pothos-graphql.dev/docs/guide/interfaces#defining-interface-types)[implementing interfaces with object types](https://pothos-graphql.dev/docs/guide/interfaces#implementing-interfaces-with-object-types)[Using an Interface as a return type](https://pothos-graphql.dev/docs/guide/interfaces#using-an-interface-as-a-return-type)[Querying interface fields](https://pothos-graphql.dev/docs/guide/interfaces#querying-interface-fields)

---

## URL: https://pothos-graphql.dev/docs/guide/generating-client-types#setting-up-graphql-code-generator

Title: Generating client types

URL Source: https://pothos-graphql.dev/docs/guide/generating-client-types

Markdown Content:
Generating client types

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 1: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Objects](https://pothos-graphql.dev/docs/guide/objects)[Queries, Mutations and Subscriptions](https://pothos-graphql.dev/docs/guide/queries-mutations-and-subscriptions)[SchemaBuilder](https://pothos-graphql.dev/docs/guide/schema-builder)[Fields](https://pothos-graphql.dev/docs/guide/fields)[Using args](https://pothos-graphql.dev/docs/guide/args)[Using Context](https://pothos-graphql.dev/docs/guide/context)[Input Objects](https://pothos-graphql.dev/docs/guide/inputs)[Enums](https://pothos-graphql.dev/docs/guide/enums)[Scalars](https://pothos-graphql.dev/docs/guide/scalars)[Interfaces](https://pothos-graphql.dev/docs/guide/interfaces)[Unions](https://pothos-graphql.dev/docs/guide/unions)[Using plugins](https://pothos-graphql.dev/docs/guide/using-plugins)[Inferring Types](https://pothos-graphql.dev/docs/guide/inferring-types)[File layout](https://pothos-graphql.dev/docs/guide/app-layout)[Generating client types](https://pothos-graphql.dev/docs/guide/generating-client-types)[Patterns](https://pothos-graphql.dev/docs/guide/patterns)[Printing Schemas](https://pothos-graphql.dev/docs/guide/printing-schemas)[Default nullability](https://pothos-graphql.dev/docs/guide/changing-default-nullability)[Writing plugins](https://pothos-graphql.dev/docs/guide/writing-plugins)[Using Deno](https://pothos-graphql.dev/docs/guide/deno)[Circular References](https://pothos-graphql.dev/docs/guide/circular-references)[Troubleshooting](https://pothos-graphql.dev/docs/guide/troubleshooting)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

Generating client types Export your schema

[Guide](https://pothos-graphql.dev/docs/guide)

# Generating client types

Pothos does not have a built in mechanism for generating types to use with a client, but [graphql-code-generator](https://www.graphql-code-generator.com/) can be configured to consume a schema directly from your typescript files.

## [Export your schema](https://pothos-graphql.dev/docs/guide/generating-client-types#export-your-schema)

The first thing you will need is a file that exports your built schema. The schema should be exported as `schema` or as the default export. This will be used to generate your client types, but can also be the schema you use in your server.

```
// schema.ts

// Import the builder
import builder from './builder';

// Import your type definitions
import './types/Query';
import './types/User';
import './types/Posts';

// Build and export the schema
export const schema = builder.toSchema();
```

## [Setting up graphql-code-generator](https://pothos-graphql.dev/docs/guide/generating-client-types#setting-up-graphql-code-generator)

There are many different ways to set up graphql-code-generator, and the details depend a lot on your needs.

See the [graphql-code-generator documentation](https://www.graphql-code-generator.com/docs/getting-started/installation) for more details.

### [Install the codegen packages](https://pothos-graphql.dev/docs/guide/generating-client-types#install-the-codegen-packages)

npm pnpm yarn bun

```
npm install --save graphql
npm install --save -D typescript @graphql-codegen/cli @graphql-codegen/client-preset
```

### [Configure the codegen to import your schema](https://pothos-graphql.dev/docs/guide/generating-client-types#configure-the-codegen-to-import-your-schema)

Create a `codegen.ts` file in the root of your project:

```
import type { CodegenConfig } from '@graphql-codegen/cli';
import { printSchema } from 'graphql';
import { schema } from './src/schema';

const config: CodegenConfig = {
  schema: printSchema(schema),
  documents: ['src/**/*.tsx'],
  generates: {
    './src/gql/': {
      preset: 'client',
      plugins: [],
    },
  },
};

export default config;
```

You can customize this config as needed, but the relevant parts are:

- Importing your GraphQL schema, this should be the result of calling `builder.toSchema({})`
- using `printSchema` from `graphql` to convert the schema to a string

## [Generating a schema.graphql file with graphql-code-generator](https://pothos-graphql.dev/docs/guide/generating-client-types#generating-a-schemagraphql-file-with-graphql-code-generator)

You can generate a schema.graphql file with graphql-code-generator by adding the `schema-ast` plugin:

npm pnpm yarn bun

`npm install --save -D @graphql-codegen/schema-ast`

```
// codegen.ts
import { printSchema } from 'graphql';
import type { CodegenConfig } from '@graphql-codegen/cli';
import { schema } from './src/schema';

const config: CodegenConfig = {
  schema: printSchema(schema),
  documents: ['src/**/*.tsx'],
  generates: {
    './src/gql/': {
      preset: 'client',
      plugins: [],
    },
    'schema.graphql': {
      plugins: ['schema-ast'],
    },
  },
};

export default config;
```

## [Adding scalars](https://pothos-graphql.dev/docs/guide/generating-client-types#adding-scalars)

If you are using scalars (e.g. from `graphql-scalars`), you will need to add them to `codegen.ts` or else they will resolve to `any`. Here is an example for `UUID` and `DateTime`:

```
const config: CodegenConfig = {
  ...,
  config: {
    scalars: {
      UUID: 'string',
      DateTime: 'Date',
    },
  },
};
```

## [Alternatives](https://pothos-graphql.dev/docs/guide/generating-client-types#alternatives)

In some cases you may want to use an alternative method for loading you schema.

### [Printing the schema to a file](https://pothos-graphql.dev/docs/guide/generating-client-types#printing-the-schema-to-a-file)

You can use the `printSchema` function from `graphql` to print your schema to a file, see [Printing Schemas](https://pothos-graphql.dev/docs/guide/printing-schemas) for more details:

By writing the schema to a file, you will be able to load the schema from a file instead importing it each time you want to generate your schema.

Having your schema written to a file, and checked into source control has many benifits, like easier code reviews, and better interoperability with other schema dependent graphql tools, so setting this up is worth while even if you do not need it for generating client types:

```
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './path/to/schema.graphql',
  documents: ['src/**/*.tsx'],
  generates: {
    './src/gql/': {
      preset: 'client',
      plugins: [],
    },
  },
};

export default config;
```

### [Using introspection from your dev (or production) server](https://pothos-graphql.dev/docs/guide/generating-client-types#using-introspection-from-your-dev-or-production-server)

Rather than using a schema SDL file, graphql-code-generator can also can use introspection to load your schema. To do this, you will need to ensure that your server has introspection enabled, most servers will have introspection enabled by default in development, and disabled in production.

You can then configure graphql-code-generator to use introspection by passing the URL to your graphql endpoint:

```
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'https://localhost:3000/graphql',
  documents: ['src/**/*.tsx'],
  generates: {
    './src/gql/': {
      preset: 'client',
      plugins: [],
    },
  },
};

export default config;
```

[File layout Guide for Pothos app layouts](https://pothos-graphql.dev/docs/guide/app-layout)[Patterns Guide for using common patterns in Pothos](https://pothos-graphql.dev/docs/guide/patterns)

### On this page

[Export your schema](https://pothos-graphql.dev/docs/guide/generating-client-types#export-your-schema)[Setting up graphql-code-generator](https://pothos-graphql.dev/docs/guide/generating-client-types#setting-up-graphql-code-generator)[Install the codegen packages](https://pothos-graphql.dev/docs/guide/generating-client-types#install-the-codegen-packages)[Configure the codegen to import your schema](https://pothos-graphql.dev/docs/guide/generating-client-types#configure-the-codegen-to-import-your-schema)[Generating a schema.graphql file with graphql-code-generator](https://pothos-graphql.dev/docs/guide/generating-client-types#generating-a-schemagraphql-file-with-graphql-code-generator)[Adding scalars](https://pothos-graphql.dev/docs/guide/generating-client-types#adding-scalars)[Alternatives](https://pothos-graphql.dev/docs/guide/generating-client-types#alternatives)[Printing the schema to a file](https://pothos-graphql.dev/docs/guide/generating-client-types#printing-the-schema-to-a-file)[Using introspection from your dev (or production) server](https://pothos-graphql.dev/docs/guide/generating-client-types#using-introspection-from-your-dev-or-production-server)

---

## URL: https://pothos-graphql.dev/docs/guide/generating-client-types#alternatives

Title: Generating client types

URL Source: https://pothos-graphql.dev/docs/guide/generating-client-types

Markdown Content:
Generating client types

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 1: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Objects](https://pothos-graphql.dev/docs/guide/objects)[Queries, Mutations and Subscriptions](https://pothos-graphql.dev/docs/guide/queries-mutations-and-subscriptions)[SchemaBuilder](https://pothos-graphql.dev/docs/guide/schema-builder)[Fields](https://pothos-graphql.dev/docs/guide/fields)[Using args](https://pothos-graphql.dev/docs/guide/args)[Using Context](https://pothos-graphql.dev/docs/guide/context)[Input Objects](https://pothos-graphql.dev/docs/guide/inputs)[Enums](https://pothos-graphql.dev/docs/guide/enums)[Scalars](https://pothos-graphql.dev/docs/guide/scalars)[Interfaces](https://pothos-graphql.dev/docs/guide/interfaces)[Unions](https://pothos-graphql.dev/docs/guide/unions)[Using plugins](https://pothos-graphql.dev/docs/guide/using-plugins)[Inferring Types](https://pothos-graphql.dev/docs/guide/inferring-types)[File layout](https://pothos-graphql.dev/docs/guide/app-layout)[Generating client types](https://pothos-graphql.dev/docs/guide/generating-client-types)[Patterns](https://pothos-graphql.dev/docs/guide/patterns)[Printing Schemas](https://pothos-graphql.dev/docs/guide/printing-schemas)[Default nullability](https://pothos-graphql.dev/docs/guide/changing-default-nullability)[Writing plugins](https://pothos-graphql.dev/docs/guide/writing-plugins)[Using Deno](https://pothos-graphql.dev/docs/guide/deno)[Circular References](https://pothos-graphql.dev/docs/guide/circular-references)[Troubleshooting](https://pothos-graphql.dev/docs/guide/troubleshooting)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

Generating client types Export your schema

[Guide](https://pothos-graphql.dev/docs/guide)

# Generating client types

Pothos does not have a built in mechanism for generating types to use with a client, but [graphql-code-generator](https://www.graphql-code-generator.com/) can be configured to consume a schema directly from your typescript files.

## [Export your schema](https://pothos-graphql.dev/docs/guide/generating-client-types#export-your-schema)

The first thing you will need is a file that exports your built schema. The schema should be exported as `schema` or as the default export. This will be used to generate your client types, but can also be the schema you use in your server.

```
// schema.ts

// Import the builder
import builder from './builder';

// Import your type definitions
import './types/Query';
import './types/User';
import './types/Posts';

// Build and export the schema
export const schema = builder.toSchema();
```

## [Setting up graphql-code-generator](https://pothos-graphql.dev/docs/guide/generating-client-types#setting-up-graphql-code-generator)

There are many different ways to set up graphql-code-generator, and the details depend a lot on your needs.

See the [graphql-code-generator documentation](https://www.graphql-code-generator.com/docs/getting-started/installation) for more details.

### [Install the codegen packages](https://pothos-graphql.dev/docs/guide/generating-client-types#install-the-codegen-packages)

npm pnpm yarn bun

```
npm install --save graphql
npm install --save -D typescript @graphql-codegen/cli @graphql-codegen/client-preset
```

### [Configure the codegen to import your schema](https://pothos-graphql.dev/docs/guide/generating-client-types#configure-the-codegen-to-import-your-schema)

Create a `codegen.ts` file in the root of your project:

```
import type { CodegenConfig } from '@graphql-codegen/cli';
import { printSchema } from 'graphql';
import { schema } from './src/schema';

const config: CodegenConfig = {
  schema: printSchema(schema),
  documents: ['src/**/*.tsx'],
  generates: {
    './src/gql/': {
      preset: 'client',
      plugins: [],
    },
  },
};

export default config;
```

You can customize this config as needed, but the relevant parts are:

- Importing your GraphQL schema, this should be the result of calling `builder.toSchema({})`
- using `printSchema` from `graphql` to convert the schema to a string

## [Generating a schema.graphql file with graphql-code-generator](https://pothos-graphql.dev/docs/guide/generating-client-types#generating-a-schemagraphql-file-with-graphql-code-generator)

You can generate a schema.graphql file with graphql-code-generator by adding the `schema-ast` plugin:

npm pnpm yarn bun

`npm install --save -D @graphql-codegen/schema-ast`

```
// codegen.ts
import { printSchema } from 'graphql';
import type { CodegenConfig } from '@graphql-codegen/cli';
import { schema } from './src/schema';

const config: CodegenConfig = {
  schema: printSchema(schema),
  documents: ['src/**/*.tsx'],
  generates: {
    './src/gql/': {
      preset: 'client',
      plugins: [],
    },
    'schema.graphql': {
      plugins: ['schema-ast'],
    },
  },
};

export default config;
```

## [Adding scalars](https://pothos-graphql.dev/docs/guide/generating-client-types#adding-scalars)

If you are using scalars (e.g. from `graphql-scalars`), you will need to add them to `codegen.ts` or else they will resolve to `any`. Here is an example for `UUID` and `DateTime`:

```
const config: CodegenConfig = {
  ...,
  config: {
    scalars: {
      UUID: 'string',
      DateTime: 'Date',
    },
  },
};
```

## [Alternatives](https://pothos-graphql.dev/docs/guide/generating-client-types#alternatives)

In some cases you may want to use an alternative method for loading you schema.

### [Printing the schema to a file](https://pothos-graphql.dev/docs/guide/generating-client-types#printing-the-schema-to-a-file)

You can use the `printSchema` function from `graphql` to print your schema to a file, see [Printing Schemas](https://pothos-graphql.dev/docs/guide/printing-schemas) for more details:

By writing the schema to a file, you will be able to load the schema from a file instead importing it each time you want to generate your schema.

Having your schema written to a file, and checked into source control has many benifits, like easier code reviews, and better interoperability with other schema dependent graphql tools, so setting this up is worth while even if you do not need it for generating client types:

```
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './path/to/schema.graphql',
  documents: ['src/**/*.tsx'],
  generates: {
    './src/gql/': {
      preset: 'client',
      plugins: [],
    },
  },
};

export default config;
```

### [Using introspection from your dev (or production) server](https://pothos-graphql.dev/docs/guide/generating-client-types#using-introspection-from-your-dev-or-production-server)

Rather than using a schema SDL file, graphql-code-generator can also can use introspection to load your schema. To do this, you will need to ensure that your server has introspection enabled, most servers will have introspection enabled by default in development, and disabled in production.

You can then configure graphql-code-generator to use introspection by passing the URL to your graphql endpoint:

```
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'https://localhost:3000/graphql',
  documents: ['src/**/*.tsx'],
  generates: {
    './src/gql/': {
      preset: 'client',
      plugins: [],
    },
  },
};

export default config;
```

[File layout Guide for Pothos app layouts](https://pothos-graphql.dev/docs/guide/app-layout)[Patterns Guide for using common patterns in Pothos](https://pothos-graphql.dev/docs/guide/patterns)

### On this page

[Export your schema](https://pothos-graphql.dev/docs/guide/generating-client-types#export-your-schema)[Setting up graphql-code-generator](https://pothos-graphql.dev/docs/guide/generating-client-types#setting-up-graphql-code-generator)[Install the codegen packages](https://pothos-graphql.dev/docs/guide/generating-client-types#install-the-codegen-packages)[Configure the codegen to import your schema](https://pothos-graphql.dev/docs/guide/generating-client-types#configure-the-codegen-to-import-your-schema)[Generating a schema.graphql file with graphql-code-generator](https://pothos-graphql.dev/docs/guide/generating-client-types#generating-a-schemagraphql-file-with-graphql-code-generator)[Adding scalars](https://pothos-graphql.dev/docs/guide/generating-client-types#adding-scalars)[Alternatives](https://pothos-graphql.dev/docs/guide/generating-client-types#alternatives)[Printing the schema to a file](https://pothos-graphql.dev/docs/guide/generating-client-types#printing-the-schema-to-a-file)[Using introspection from your dev (or production) server](https://pothos-graphql.dev/docs/guide/generating-client-types#using-introspection-from-your-dev-or-production-server)

---

## URL: https://pothos-graphql.dev/docs/guide/writing-plugins#pothosschematypes

Title: Writing plugins

URL Source: https://pothos-graphql.dev/docs/guide/writing-plugins

Markdown Content:
Writing plugins for Pothos may seem a little intimidating at first, because the types used by Pothos are fairly complex. Fortunately, for many types of plugins, the process is actually pretty easy, once you understand the core concepts of how Pothos's type system works. Don't worry if the descriptions don't make complete sense at first. Going through the examples in this guide will hopefully make things seem a lot easier. This guide aims to cover a lot of the most common use cases for creating plugins, but does not contain full API documentation. Exploring the types or source code to see what all is available is highly encouraged, but should not be required for most use cases.

Pothos has 2 main pieces to it's type system:

1.  `PothosSchemaTypes`: A global namespace for shared types
2.  `SchemaTypes`: A collection of types passed around through Generics specific to each instance of `SchemaBuilder`

### [`PothosSchemaTypes`](https://pothos-graphql.dev/docs/guide/writing-plugins#pothosschematypes)

The `PothosSchemaTypes` contains interfaces for all the various options objects used throughout the API, along with some other types that plugins may want to extend. Each of the interfaces can be extended by a plugin to add new options. Each interface takes a number of relevant generic parameters that can be used to make the options more useful. For example, the interface for field options will be passed the shape of the parent, the expected return type, and any arguments.

### [`SchemaTypes`](https://pothos-graphql.dev/docs/guide/writing-plugins#schematypes)

The `SchemaTypes` type is based on the Generic argument passed to the `SchemaBuilder`, and extended with reasonable defaults. Almost every interface in the `PothosSchemaTypes` will have access to it (look for `Types extends SchemaTypes` in the generics of almost any interface). This Type contains the types for Scalars, backing models for some object and interface types, and many custom properties from various plugins. If your plugin needs the user to provide some types that will be shared across the whole schema, this is how you will be able to access them when adding fields to the options objects defined in `PothosSchemaTypes`.

The best place to start is by looking through the [example plugin](https://github.com/hayes/pothos/tree/main/packages/plugin-example).

The general structure of a plugin has 3 main parts:

1.  `index.ts` which contains a plugins actual implementation
2.  `global-types.ts` which contains any additions to `Pothos`s built in types.
3.  `types.ts` which should contain any types that do NOT belong to the global `PothosSchemaTypes` namespace.

To get set up quickly, you can copy these files from the example plugin to suit your needs. The first few things to change are:

1.  The plugin name in `index.ts`
2.  The name of the Plugin class in `index.ts`
3.  The name key/name for the plugin in the `Plugins` interface in `global-types.ts`

After setting up the basic layout of your plugin, I recommend starting by defining the types for your plugin first (in `global-types.ts`) and setting up a test schema that uses your plugin. This allows you to get the user facing API for your plugin working first, so you can see that any new options you add to the API are working as expected, and that any type constraints are enforced correctly. Once you are happy with your API, you can start building out the functionality in index.ts. Building the types first also make the implementation easier because the properties you will need to access in your extension may not exist on the config objects until you have defined your types.

### [`global-types.ts`](https://pothos-graphql.dev/docs/guide/writing-plugins#global-typests)

`global-types.ts` must contain the following:

1.  A declaration of the `PothosSchemaTypes` namespace

2.  An addition to the `Plugins` interface that maps the plugin name, to the plugin type (this needs to be inside the `PothosSchemaTypes` namespace)

`global-types.ts` should NOT include definitions that do not belong to the `PothosSchemaTypes` namespace. Types for your plugin should be added to a separate `types.ts` file, and imported as needed into `global-types.ts`.

To add properties to the various config objects used by the `SchemaBuilder`, you should start by finding the interface that defines that config object in `@pothos/core`. Currently there are 4 main file that define the types that make up `PothosSchemaTypes` namespace.

1.  [`type-options.ts`](https://github.com/hayes/pothos/blob/main/packages/core/src/types/global/type-options.ts):

Contains the interfaces that define the options objects for the various types (Object, Interface, Enum, etc).

2.  [`field-options.ts`](https://github.com/hayes/pothos/blob/main/packages/core/src/types/global/field-options.ts):

Contains the interfaces that define the options objects for creating fields

3.  [`schema-types.ts`](https://github.com/hayes/pothos/blob/main/packages/core/src/types/global/schema-types.ts):

Contains the interfaces for SchemaBuilder options, SchemaTypes, options for `toSchema`, and other utility interfaces that may be useful for plugins to extend that do not fall into one of the other categories.

4.  [`classes.ts`](https://github.com/hayes/pothos/blob/main/packages/core/src/types/global/classes.ts):

Contains interfaces that describe the classes used by Pothos, include `SchemaBuilder` and the various field builder classes.

Once you have identified a type you wish to extend, copy it into the `PothosSchemaTypes` namespace in your `global-types.ts`, but remove all the existing properties. You will need to keep all the Generics used by the interface, and should import the types used in generics from `@pothos/core`. You can now add any new properties to the interface that your plugin needs. Making new properties optional (`newProp?: TypeOfProp`) is recommended for most use cases.

`index.ts` must contain the following:

1.  A bare import of the global types (`import './global-types';`)

2.  The plugins name, which should be typed as a string literal rather than as a generic string:

`const pluginName = 'example'`

3.  A default export of the plugin name `export default pluginName`

4.  A class that extends BasePlugin: `export class PothosExamplePlugin<Types extends SchemaTypes> extends BasePlugin<Types> {}`

`BasePlugin` and `SchemaTypes` can both be imported from `@pothos/core`

5.  A call to register the plugin: `SchemaBuilder.registerPlugin(pluginName, PothosExamplePlugin);`

`SchemaBuilder` can also be imported from `@pothos/core`

### [Life cycle hooks](https://pothos-graphql.dev/docs/guide/writing-plugins#life-cycle-hooks)

The `SchemaBuilder` will instantiate plugins each time the `toSchema` method is called on the builder. As the schema is built, it will invoke the various life cycle methods on each plugin if they have been defined.

To hook into each lifecycle event, simply define the corresponding function in your plugin class. For the exact function signature, see the `index.ts` of the example plugin.

- `onTypeConfig`: Invoked for each type, with the config object that will be used to construct the underlying GraphQL type.

- `onOutputFieldConfig`: Invoked for each Object, or Interface field, with the config object describing the field.

- `onInputFieldConfig`: Invoked for each InputObject field, or field argument, with the config object describing the field.

- `onEnumValueConfig`: Invoked for each value in an enum

- `beforeBuild`: Invoked before building schemas, last chance to add new types or fields.

- `afterBuild`: Invoked with the fully built Schema.

- `wrapResolve`: Invoked when creating the resolver for each field

- `wrapSubscribe`: Invoked for each field in the `Subscriptions` object.

- `wrapResolveType`: Invoked for each Union and Interface.

Each of the lifecycle methods above (except `beforeBuild`) expect a return value that matches their first argument (either a config object, or the resolve/subscribe/resolveType function). If your plugin does not need to modify these values, it can simple return the value that was passed in. When your plugin does need to change one of the config values, you should return a copy of the config object with your modifications, rather than modifying the config object that was passed in. This can be done by either using `Object.assign`, or spreading the original config into a new object `{...originalConfig, newProp: newValue }`.

Each config object will have the properties expected by the GraphQL for creating the types or fields (although some properties like `resolve` will be added later), but will also include a number of Pothos specific properties. These properties include `graphqlKind` to indicate what kind of GraphQL type the config object is for, `pothosOptions`, which contains all the options passed in to the schema builder when creating the type or field.

If your plugin needs to add additional types or fields to the schema it should do this in the `beforeBuild` hook. Any types added to the schema after this, may not be included correctly. Plugins should also account for the fact that a new instance of the plugin will be created each time the schema is called, so any types or fields added the the schema should only be applied once (per schema), even if multiple instances of the plugin are created. The help with this, there is a `runUnique` helper on the base plugin class, which accepts a key, and a callback, and will only run a callback once per schema for the given key.

Below are a few of the most common use cases for how a plugin might extend the Pothos with very simplified examples. Most plugins will likely need a combination of these strategies, and some uses cases may not be well documented. If you are unsure about how to solve a specific problem, feel free to open a GitHub Issue for more help.

In the examples below, when "extending an interface", the interface should be added to the `PothosSchemaTypes` namespace in `global-types.ts`.

### [Adding options to the SchemaBuilder constructor](https://pothos-graphql.dev/docs/guide/writing-plugins#adding-options-to-the-schemabuilder-constructor)

You may have noticed that plugins are not instantiated by the user, and therefore users can't pass options directly into your plugin when creating it. Instead, the recommended way to configure your plugin is by contributing new properties to the options object passed the the SchemaBuilder constructor. This can be done by extending the `SchemaBuilderOptions` interface.

Extending this interface will allow the user to pass in these new options when creating an instance of `SchemaBuilder`.

You can then access the options through `this.builder.options` in your plugin, with everything correctly typed:

### [Adding options when building a schema (`toSchema`)](https://pothos-graphql.dev/docs/guide/writing-plugins#adding-options-when-building-a-schema-toschema)

In some cases, your plugin may be designed for schemas that be built in different modes. For example the mocks plugin allows the schema to be built repeatedly with different sets of mocks, or the subGraph allows building a schema multiple times to generate separate subgraphs. For these cases, you can extend the options passed to `toSchema` instead:

These options can be accessed through `this.options` in your plugin:

### [Adding options to types](https://pothos-graphql.dev/docs/guide/writing-plugins#adding-options-to-types)

Each GraphQL type has it's own options interface which can be extended. For example, to extend the options for creating an Object type:

These options can then be accessed in your plugin when you receive the config for the type:

In the example above, we need to check `typeConfig.kind` to ensure that the type config is for an object. Without this check, typescript will not know that the config object is for an object, and will not let us access the property. `typeConfig.kind` corresponds to how Pothos splits up Types for its config objects, meaning that it has separate `kind`s for `Query`, `Mutation`, and `Subscription` even though these are all `Objects` in GraphQL terminology. The `typeConfig.graphqlKind` can be used to get the actual GraphQL type instead.

### [Adding options to fields](https://pothos-graphql.dev/docs/guide/writing-plugins#adding-options-to-fields)

Similar to Types, fields also have a number of interfaces that can be extended to add options to various types of fields:

Field interfaces have a few more generics than other interfaces we have looked at. These generics can be used to make the options you add more specific to the field currently being defined. It is important to copy all the generics of the interfaces as they are defined in `@pothos/core` even if you do not use the generics in your own properties. If the generics do not match, typescript won't be able to merge the definitions. You do NOT need to include the `extends` clause of the interface, if the interface extends another interface (like `FieldOptions`).

Similar to Type options, Field options will be available in the fieldConfigs in your plugin, once you check that the fieldConfig is for the correct `kind` of field.

### [Adding new methods on builder classes](https://pothos-graphql.dev/docs/guide/writing-plugins#adding-new-methods-on-builder-classes)

Adding new method to `SchemaBuilder` or one of the `FieldBuilder` classes is also done through extending interfaces. Extending these interfaces is how typescript is able to know these methods exist, even though they are not defined on the original classes.

The above is a simple example of defining a new `buildCustomObject` method that takes no arguments, and returns a reference to a new custom object type. Defining this type will not work on it's own, and we still need to define the actual implementation of this method. This might look like:

Note that the above function does NOT use an arrow function, so that the function can access `this` as a reference the the SchemaBuilder instance.

### [Wrapping resolvers to add runtime functionality](https://pothos-graphql.dev/docs/guide/writing-plugins#wrapping-resolvers-to-add-runtime-functionality)

Some plugins will need to add runtime behavior. There are a few lifecycle hooks for wrapping `resolve`, `subscribe`, and `resolveType`. These hooks will receive the function they are wrapping, along with a config object for the field or type they are associated with, and should return either the original function, or a wrapper function with the same API.

It is important to remember that resolvers can resolve values in a number of ways (normal values, promises, or even something as complicated `Promise<(Promise<T> | T)[]>`. So be careful when using a wrapper that introspected the return value of a resolve function. Plugins should only wrap resolvers when absolutely necessary.

### [Transforming a schema](https://pothos-graphql.dev/docs/guide/writing-plugins#transforming-a-schema)

For some plugins the other provided lifecycle may not be sufficiently powerful to modify the schema in all the ways a plugin may want. For example removing types from the schema (eg. the `SubGraph` plugin). In these cases, the `afterBuild` hook can be used. It receives the built schema, and is expected to return either the schema it was passed, or a completely new schema. This allows plugins to use 3rd party libraries like `graphql-tools` to arbitrarily transform schemas if desired.

### [Using SchemaTypes](https://pothos-graphql.dev/docs/guide/writing-plugins#using-schematypes)

You may have noticed that almost every interface and type in `@pothos/core` take a generic that looks like: `Types extends SchemaTypes`. This type is what allows Pothos and its plugins to share type information across the entire schema, and to incorporate user defined types into that system. These SchemaTypes are a combination of default types merged with the Types provided in the Generic parameter of the SchemaBuilder constructor, and includes a wide variety of useful types:

- Types for all the scalars
- Types for backing models used by objects and interfaces when referenced via strings
- The type used for the context and root objects
- Settings for default nullability of fields
- Any user defined types specific to plugins (more info below)

There are many ways these types can be used, but one of the most common is to access the type for the context object, so that you can correctly type a callback function for your plugin that accepts the context object.

### [Using user defined types](https://pothos-graphql.dev/docs/guide/writing-plugins#using-user-defined-types)

As mentioned above, your plugin can also contribute its own user definable types to the SchemaTypes interface. You can see examples of this in the several of the plugins including the directives and `scope-auth` plugins. Adding your own types to SchemaTypes requires extending 2 interfaces: The `UserSchemaTypes` which describes the user provided type will need to extend, and the `ExtendDefaultTypes` interface, which is used to set default values if the User does not provide their own types.

The User provided type can then be accessed using `Types['NewExampleTypes']` in any interface or type that receive `SchemaTypes` as a generic argument.

### [Request data](https://pothos-graphql.dev/docs/guide/writing-plugins#request-data)

Plugins that wrap resolvers may need to store some data that us unique the current request. In these cases your plugin can define a `createRequestData` method, and use the `requestData` method to get the data for the current request.

The shape of requestData can be defined via the second generic parameter of the `BasePlugin` class. The `requestData` method expects the context object as its only argument, which is used to uniquely identify the current request.

### [Wrapping arguments and inputs](https://pothos-graphql.dev/docs/guide/writing-plugins#wrapping-arguments-and-inputs)

The plugin API does not directly have a method for wrapping input fields, instead, the `wrapResolve` and `wrapSubscribe` methods can be used to modify the `args` object before passing it down to the original resolver.

Figuring out how to wrap inputs can be a little complex, especially when dealing with recursive inputs, and optimizing to wrap as little as possible. To help with this, Pothos has a couple of utility functions that can make this easier:

- `mapInputFields`: Used to select affected input fields and extract some configuration
- `createInputValueMapper`: Creates a mapping function that uses the result of `mapInputFields` to map inputs in an args object to new values.

The relay plugin uses these methods to decode `globalID` inputs:

Using these utilities allows moving more logic to build time (figuring out which fields need mapping) so that the runtime overhead is as small as possible.

`createInputValueMapper` may be useful for some use cases, for some plugins it may be better to create a custom mapping function, but still use the result of `mapInputFields`.

`mapInputFields` returns a map who's keys are field/argument names, and who's values are objects with the following shape:

if the `kind` is `InputObject` then the mapping object will also have a fields property with an object of the following shape:

Both the root level map, and the `fields.map` maps will only contain entries for fields where the mapping function did not return null. If the mapping function returned null for all fields, the `mapInputFields` will return null instead of returning a map to indicate no wrapping should occur

### [Removing fields and enum values](https://pothos-graphql.dev/docs/guide/writing-plugins#removing-fields-and-enum-values)

Plugins can remove fields from objects, interfaces, and input objects, and remove specific values from enums. To do this, simply return null from the corresponding on\*Config plugin hook:

Removing whole types from the schema needs to be done by transforming the schema during the `afterBuild` hook. See the `sub-graph` plugin for a more complete example of removing types.

- `builder.configStore.onTypeConfig`: Takes a type ref and a callback, and will invoke the callback with the config for the referenced type once available.

- `fieldRef.onFirstUse` Takes a callback to invoke once the config for the field is available.

- `buildCache.getTypeConfig` Gets the config for a given type after it has been passed through any modifications applied by plugins.

---

## URL: https://pothos-graphql.dev/docs/guide/writing-plugins#schematypes

Title: Writing plugins

URL Source: https://pothos-graphql.dev/docs/guide/writing-plugins

Markdown Content:
Writing plugins for Pothos may seem a little intimidating at first, because the types used by Pothos are fairly complex. Fortunately, for many types of plugins, the process is actually pretty easy, once you understand the core concepts of how Pothos's type system works. Don't worry if the descriptions don't make complete sense at first. Going through the examples in this guide will hopefully make things seem a lot easier. This guide aims to cover a lot of the most common use cases for creating plugins, but does not contain full API documentation. Exploring the types or source code to see what all is available is highly encouraged, but should not be required for most use cases.

Pothos has 2 main pieces to it's type system:

1.  `PothosSchemaTypes`: A global namespace for shared types
2.  `SchemaTypes`: A collection of types passed around through Generics specific to each instance of `SchemaBuilder`

### [`PothosSchemaTypes`](https://pothos-graphql.dev/docs/guide/writing-plugins#pothosschematypes)

The `PothosSchemaTypes` contains interfaces for all the various options objects used throughout the API, along with some other types that plugins may want to extend. Each of the interfaces can be extended by a plugin to add new options. Each interface takes a number of relevant generic parameters that can be used to make the options more useful. For example, the interface for field options will be passed the shape of the parent, the expected return type, and any arguments.

### [`SchemaTypes`](https://pothos-graphql.dev/docs/guide/writing-plugins#schematypes)

The `SchemaTypes` type is based on the Generic argument passed to the `SchemaBuilder`, and extended with reasonable defaults. Almost every interface in the `PothosSchemaTypes` will have access to it (look for `Types extends SchemaTypes` in the generics of almost any interface). This Type contains the types for Scalars, backing models for some object and interface types, and many custom properties from various plugins. If your plugin needs the user to provide some types that will be shared across the whole schema, this is how you will be able to access them when adding fields to the options objects defined in `PothosSchemaTypes`.

The best place to start is by looking through the [example plugin](https://github.com/hayes/pothos/tree/main/packages/plugin-example).

The general structure of a plugin has 3 main parts:

1.  `index.ts` which contains a plugins actual implementation
2.  `global-types.ts` which contains any additions to `Pothos`s built in types.
3.  `types.ts` which should contain any types that do NOT belong to the global `PothosSchemaTypes` namespace.

To get set up quickly, you can copy these files from the example plugin to suit your needs. The first few things to change are:

1.  The plugin name in `index.ts`
2.  The name of the Plugin class in `index.ts`
3.  The name key/name for the plugin in the `Plugins` interface in `global-types.ts`

After setting up the basic layout of your plugin, I recommend starting by defining the types for your plugin first (in `global-types.ts`) and setting up a test schema that uses your plugin. This allows you to get the user facing API for your plugin working first, so you can see that any new options you add to the API are working as expected, and that any type constraints are enforced correctly. Once you are happy with your API, you can start building out the functionality in index.ts. Building the types first also make the implementation easier because the properties you will need to access in your extension may not exist on the config objects until you have defined your types.

### [`global-types.ts`](https://pothos-graphql.dev/docs/guide/writing-plugins#global-typests)

`global-types.ts` must contain the following:

1.  A declaration of the `PothosSchemaTypes` namespace

2.  An addition to the `Plugins` interface that maps the plugin name, to the plugin type (this needs to be inside the `PothosSchemaTypes` namespace)

`global-types.ts` should NOT include definitions that do not belong to the `PothosSchemaTypes` namespace. Types for your plugin should be added to a separate `types.ts` file, and imported as needed into `global-types.ts`.

To add properties to the various config objects used by the `SchemaBuilder`, you should start by finding the interface that defines that config object in `@pothos/core`. Currently there are 4 main file that define the types that make up `PothosSchemaTypes` namespace.

1.  [`type-options.ts`](https://github.com/hayes/pothos/blob/main/packages/core/src/types/global/type-options.ts):

Contains the interfaces that define the options objects for the various types (Object, Interface, Enum, etc).

2.  [`field-options.ts`](https://github.com/hayes/pothos/blob/main/packages/core/src/types/global/field-options.ts):

Contains the interfaces that define the options objects for creating fields

3.  [`schema-types.ts`](https://github.com/hayes/pothos/blob/main/packages/core/src/types/global/schema-types.ts):

Contains the interfaces for SchemaBuilder options, SchemaTypes, options for `toSchema`, and other utility interfaces that may be useful for plugins to extend that do not fall into one of the other categories.

4.  [`classes.ts`](https://github.com/hayes/pothos/blob/main/packages/core/src/types/global/classes.ts):

Contains interfaces that describe the classes used by Pothos, include `SchemaBuilder` and the various field builder classes.

Once you have identified a type you wish to extend, copy it into the `PothosSchemaTypes` namespace in your `global-types.ts`, but remove all the existing properties. You will need to keep all the Generics used by the interface, and should import the types used in generics from `@pothos/core`. You can now add any new properties to the interface that your plugin needs. Making new properties optional (`newProp?: TypeOfProp`) is recommended for most use cases.

`index.ts` must contain the following:

1.  A bare import of the global types (`import './global-types';`)

2.  The plugins name, which should be typed as a string literal rather than as a generic string:

`const pluginName = 'example'`

3.  A default export of the plugin name `export default pluginName`

4.  A class that extends BasePlugin: `export class PothosExamplePlugin<Types extends SchemaTypes> extends BasePlugin<Types> {}`

`BasePlugin` and `SchemaTypes` can both be imported from `@pothos/core`

5.  A call to register the plugin: `SchemaBuilder.registerPlugin(pluginName, PothosExamplePlugin);`

`SchemaBuilder` can also be imported from `@pothos/core`

### [Life cycle hooks](https://pothos-graphql.dev/docs/guide/writing-plugins#life-cycle-hooks)

The `SchemaBuilder` will instantiate plugins each time the `toSchema` method is called on the builder. As the schema is built, it will invoke the various life cycle methods on each plugin if they have been defined.

To hook into each lifecycle event, simply define the corresponding function in your plugin class. For the exact function signature, see the `index.ts` of the example plugin.

- `onTypeConfig`: Invoked for each type, with the config object that will be used to construct the underlying GraphQL type.

- `onOutputFieldConfig`: Invoked for each Object, or Interface field, with the config object describing the field.

- `onInputFieldConfig`: Invoked for each InputObject field, or field argument, with the config object describing the field.

- `onEnumValueConfig`: Invoked for each value in an enum

- `beforeBuild`: Invoked before building schemas, last chance to add new types or fields.

- `afterBuild`: Invoked with the fully built Schema.

- `wrapResolve`: Invoked when creating the resolver for each field

- `wrapSubscribe`: Invoked for each field in the `Subscriptions` object.

- `wrapResolveType`: Invoked for each Union and Interface.

Each of the lifecycle methods above (except `beforeBuild`) expect a return value that matches their first argument (either a config object, or the resolve/subscribe/resolveType function). If your plugin does not need to modify these values, it can simple return the value that was passed in. When your plugin does need to change one of the config values, you should return a copy of the config object with your modifications, rather than modifying the config object that was passed in. This can be done by either using `Object.assign`, or spreading the original config into a new object `{...originalConfig, newProp: newValue }`.

Each config object will have the properties expected by the GraphQL for creating the types or fields (although some properties like `resolve` will be added later), but will also include a number of Pothos specific properties. These properties include `graphqlKind` to indicate what kind of GraphQL type the config object is for, `pothosOptions`, which contains all the options passed in to the schema builder when creating the type or field.

If your plugin needs to add additional types or fields to the schema it should do this in the `beforeBuild` hook. Any types added to the schema after this, may not be included correctly. Plugins should also account for the fact that a new instance of the plugin will be created each time the schema is called, so any types or fields added the the schema should only be applied once (per schema), even if multiple instances of the plugin are created. The help with this, there is a `runUnique` helper on the base plugin class, which accepts a key, and a callback, and will only run a callback once per schema for the given key.

Below are a few of the most common use cases for how a plugin might extend the Pothos with very simplified examples. Most plugins will likely need a combination of these strategies, and some uses cases may not be well documented. If you are unsure about how to solve a specific problem, feel free to open a GitHub Issue for more help.

In the examples below, when "extending an interface", the interface should be added to the `PothosSchemaTypes` namespace in `global-types.ts`.

### [Adding options to the SchemaBuilder constructor](https://pothos-graphql.dev/docs/guide/writing-plugins#adding-options-to-the-schemabuilder-constructor)

You may have noticed that plugins are not instantiated by the user, and therefore users can't pass options directly into your plugin when creating it. Instead, the recommended way to configure your plugin is by contributing new properties to the options object passed the the SchemaBuilder constructor. This can be done by extending the `SchemaBuilderOptions` interface.

Extending this interface will allow the user to pass in these new options when creating an instance of `SchemaBuilder`.

You can then access the options through `this.builder.options` in your plugin, with everything correctly typed:

### [Adding options when building a schema (`toSchema`)](https://pothos-graphql.dev/docs/guide/writing-plugins#adding-options-when-building-a-schema-toschema)

In some cases, your plugin may be designed for schemas that be built in different modes. For example the mocks plugin allows the schema to be built repeatedly with different sets of mocks, or the subGraph allows building a schema multiple times to generate separate subgraphs. For these cases, you can extend the options passed to `toSchema` instead:

These options can be accessed through `this.options` in your plugin:

### [Adding options to types](https://pothos-graphql.dev/docs/guide/writing-plugins#adding-options-to-types)

Each GraphQL type has it's own options interface which can be extended. For example, to extend the options for creating an Object type:

These options can then be accessed in your plugin when you receive the config for the type:

In the example above, we need to check `typeConfig.kind` to ensure that the type config is for an object. Without this check, typescript will not know that the config object is for an object, and will not let us access the property. `typeConfig.kind` corresponds to how Pothos splits up Types for its config objects, meaning that it has separate `kind`s for `Query`, `Mutation`, and `Subscription` even though these are all `Objects` in GraphQL terminology. The `typeConfig.graphqlKind` can be used to get the actual GraphQL type instead.

### [Adding options to fields](https://pothos-graphql.dev/docs/guide/writing-plugins#adding-options-to-fields)

Similar to Types, fields also have a number of interfaces that can be extended to add options to various types of fields:

Field interfaces have a few more generics than other interfaces we have looked at. These generics can be used to make the options you add more specific to the field currently being defined. It is important to copy all the generics of the interfaces as they are defined in `@pothos/core` even if you do not use the generics in your own properties. If the generics do not match, typescript won't be able to merge the definitions. You do NOT need to include the `extends` clause of the interface, if the interface extends another interface (like `FieldOptions`).

Similar to Type options, Field options will be available in the fieldConfigs in your plugin, once you check that the fieldConfig is for the correct `kind` of field.

### [Adding new methods on builder classes](https://pothos-graphql.dev/docs/guide/writing-plugins#adding-new-methods-on-builder-classes)

Adding new method to `SchemaBuilder` or one of the `FieldBuilder` classes is also done through extending interfaces. Extending these interfaces is how typescript is able to know these methods exist, even though they are not defined on the original classes.

The above is a simple example of defining a new `buildCustomObject` method that takes no arguments, and returns a reference to a new custom object type. Defining this type will not work on it's own, and we still need to define the actual implementation of this method. This might look like:

Note that the above function does NOT use an arrow function, so that the function can access `this` as a reference the the SchemaBuilder instance.

### [Wrapping resolvers to add runtime functionality](https://pothos-graphql.dev/docs/guide/writing-plugins#wrapping-resolvers-to-add-runtime-functionality)

Some plugins will need to add runtime behavior. There are a few lifecycle hooks for wrapping `resolve`, `subscribe`, and `resolveType`. These hooks will receive the function they are wrapping, along with a config object for the field or type they are associated with, and should return either the original function, or a wrapper function with the same API.

It is important to remember that resolvers can resolve values in a number of ways (normal values, promises, or even something as complicated `Promise<(Promise<T> | T)[]>`. So be careful when using a wrapper that introspected the return value of a resolve function. Plugins should only wrap resolvers when absolutely necessary.

### [Transforming a schema](https://pothos-graphql.dev/docs/guide/writing-plugins#transforming-a-schema)

For some plugins the other provided lifecycle may not be sufficiently powerful to modify the schema in all the ways a plugin may want. For example removing types from the schema (eg. the `SubGraph` plugin). In these cases, the `afterBuild` hook can be used. It receives the built schema, and is expected to return either the schema it was passed, or a completely new schema. This allows plugins to use 3rd party libraries like `graphql-tools` to arbitrarily transform schemas if desired.

### [Using SchemaTypes](https://pothos-graphql.dev/docs/guide/writing-plugins#using-schematypes)

You may have noticed that almost every interface and type in `@pothos/core` take a generic that looks like: `Types extends SchemaTypes`. This type is what allows Pothos and its plugins to share type information across the entire schema, and to incorporate user defined types into that system. These SchemaTypes are a combination of default types merged with the Types provided in the Generic parameter of the SchemaBuilder constructor, and includes a wide variety of useful types:

- Types for all the scalars
- Types for backing models used by objects and interfaces when referenced via strings
- The type used for the context and root objects
- Settings for default nullability of fields
- Any user defined types specific to plugins (more info below)

There are many ways these types can be used, but one of the most common is to access the type for the context object, so that you can correctly type a callback function for your plugin that accepts the context object.

### [Using user defined types](https://pothos-graphql.dev/docs/guide/writing-plugins#using-user-defined-types)

As mentioned above, your plugin can also contribute its own user definable types to the SchemaTypes interface. You can see examples of this in the several of the plugins including the directives and `scope-auth` plugins. Adding your own types to SchemaTypes requires extending 2 interfaces: The `UserSchemaTypes` which describes the user provided type will need to extend, and the `ExtendDefaultTypes` interface, which is used to set default values if the User does not provide their own types.

The User provided type can then be accessed using `Types['NewExampleTypes']` in any interface or type that receive `SchemaTypes` as a generic argument.

### [Request data](https://pothos-graphql.dev/docs/guide/writing-plugins#request-data)

Plugins that wrap resolvers may need to store some data that us unique the current request. In these cases your plugin can define a `createRequestData` method, and use the `requestData` method to get the data for the current request.

The shape of requestData can be defined via the second generic parameter of the `BasePlugin` class. The `requestData` method expects the context object as its only argument, which is used to uniquely identify the current request.

### [Wrapping arguments and inputs](https://pothos-graphql.dev/docs/guide/writing-plugins#wrapping-arguments-and-inputs)

The plugin API does not directly have a method for wrapping input fields, instead, the `wrapResolve` and `wrapSubscribe` methods can be used to modify the `args` object before passing it down to the original resolver.

Figuring out how to wrap inputs can be a little complex, especially when dealing with recursive inputs, and optimizing to wrap as little as possible. To help with this, Pothos has a couple of utility functions that can make this easier:

- `mapInputFields`: Used to select affected input fields and extract some configuration
- `createInputValueMapper`: Creates a mapping function that uses the result of `mapInputFields` to map inputs in an args object to new values.

The relay plugin uses these methods to decode `globalID` inputs:

Using these utilities allows moving more logic to build time (figuring out which fields need mapping) so that the runtime overhead is as small as possible.

`createInputValueMapper` may be useful for some use cases, for some plugins it may be better to create a custom mapping function, but still use the result of `mapInputFields`.

`mapInputFields` returns a map who's keys are field/argument names, and who's values are objects with the following shape:

if the `kind` is `InputObject` then the mapping object will also have a fields property with an object of the following shape:

Both the root level map, and the `fields.map` maps will only contain entries for fields where the mapping function did not return null. If the mapping function returned null for all fields, the `mapInputFields` will return null instead of returning a map to indicate no wrapping should occur

### [Removing fields and enum values](https://pothos-graphql.dev/docs/guide/writing-plugins#removing-fields-and-enum-values)

Plugins can remove fields from objects, interfaces, and input objects, and remove specific values from enums. To do this, simply return null from the corresponding on\*Config plugin hook:

Removing whole types from the schema needs to be done by transforming the schema during the `afterBuild` hook. See the `sub-graph` plugin for a more complete example of removing types.

- `builder.configStore.onTypeConfig`: Takes a type ref and a callback, and will invoke the callback with the config for the referenced type once available.

- `fieldRef.onFirstUse` Takes a callback to invoke once the config for the field is available.

- `buildCache.getTypeConfig` Gets the config for a given type after it has been passed through any modifications applied by plugins.

---

## URL: https://pothos-graphql.dev/docs/guide/writing-plugins#global-typests

Title: Writing plugins

URL Source: https://pothos-graphql.dev/docs/guide/writing-plugins

Markdown Content:
Writing plugins for Pothos may seem a little intimidating at first, because the types used by Pothos are fairly complex. Fortunately, for many types of plugins, the process is actually pretty easy, once you understand the core concepts of how Pothos's type system works. Don't worry if the descriptions don't make complete sense at first. Going through the examples in this guide will hopefully make things seem a lot easier. This guide aims to cover a lot of the most common use cases for creating plugins, but does not contain full API documentation. Exploring the types or source code to see what all is available is highly encouraged, but should not be required for most use cases.

Pothos has 2 main pieces to it's type system:

1.  `PothosSchemaTypes`: A global namespace for shared types
2.  `SchemaTypes`: A collection of types passed around through Generics specific to each instance of `SchemaBuilder`

### [`PothosSchemaTypes`](https://pothos-graphql.dev/docs/guide/writing-plugins#pothosschematypes)

The `PothosSchemaTypes` contains interfaces for all the various options objects used throughout the API, along with some other types that plugins may want to extend. Each of the interfaces can be extended by a plugin to add new options. Each interface takes a number of relevant generic parameters that can be used to make the options more useful. For example, the interface for field options will be passed the shape of the parent, the expected return type, and any arguments.

### [`SchemaTypes`](https://pothos-graphql.dev/docs/guide/writing-plugins#schematypes)

The `SchemaTypes` type is based on the Generic argument passed to the `SchemaBuilder`, and extended with reasonable defaults. Almost every interface in the `PothosSchemaTypes` will have access to it (look for `Types extends SchemaTypes` in the generics of almost any interface). This Type contains the types for Scalars, backing models for some object and interface types, and many custom properties from various plugins. If your plugin needs the user to provide some types that will be shared across the whole schema, this is how you will be able to access them when adding fields to the options objects defined in `PothosSchemaTypes`.

The best place to start is by looking through the [example plugin](https://github.com/hayes/pothos/tree/main/packages/plugin-example).

The general structure of a plugin has 3 main parts:

1.  `index.ts` which contains a plugins actual implementation
2.  `global-types.ts` which contains any additions to `Pothos`s built in types.
3.  `types.ts` which should contain any types that do NOT belong to the global `PothosSchemaTypes` namespace.

To get set up quickly, you can copy these files from the example plugin to suit your needs. The first few things to change are:

1.  The plugin name in `index.ts`
2.  The name of the Plugin class in `index.ts`
3.  The name key/name for the plugin in the `Plugins` interface in `global-types.ts`

After setting up the basic layout of your plugin, I recommend starting by defining the types for your plugin first (in `global-types.ts`) and setting up a test schema that uses your plugin. This allows you to get the user facing API for your plugin working first, so you can see that any new options you add to the API are working as expected, and that any type constraints are enforced correctly. Once you are happy with your API, you can start building out the functionality in index.ts. Building the types first also make the implementation easier because the properties you will need to access in your extension may not exist on the config objects until you have defined your types.

### [`global-types.ts`](https://pothos-graphql.dev/docs/guide/writing-plugins#global-typests)

`global-types.ts` must contain the following:

1.  A declaration of the `PothosSchemaTypes` namespace

2.  An addition to the `Plugins` interface that maps the plugin name, to the plugin type (this needs to be inside the `PothosSchemaTypes` namespace)

`global-types.ts` should NOT include definitions that do not belong to the `PothosSchemaTypes` namespace. Types for your plugin should be added to a separate `types.ts` file, and imported as needed into `global-types.ts`.

To add properties to the various config objects used by the `SchemaBuilder`, you should start by finding the interface that defines that config object in `@pothos/core`. Currently there are 4 main file that define the types that make up `PothosSchemaTypes` namespace.

1.  [`type-options.ts`](https://github.com/hayes/pothos/blob/main/packages/core/src/types/global/type-options.ts):

Contains the interfaces that define the options objects for the various types (Object, Interface, Enum, etc).

2.  [`field-options.ts`](https://github.com/hayes/pothos/blob/main/packages/core/src/types/global/field-options.ts):

Contains the interfaces that define the options objects for creating fields

3.  [`schema-types.ts`](https://github.com/hayes/pothos/blob/main/packages/core/src/types/global/schema-types.ts):

Contains the interfaces for SchemaBuilder options, SchemaTypes, options for `toSchema`, and other utility interfaces that may be useful for plugins to extend that do not fall into one of the other categories.

4.  [`classes.ts`](https://github.com/hayes/pothos/blob/main/packages/core/src/types/global/classes.ts):

Contains interfaces that describe the classes used by Pothos, include `SchemaBuilder` and the various field builder classes.

Once you have identified a type you wish to extend, copy it into the `PothosSchemaTypes` namespace in your `global-types.ts`, but remove all the existing properties. You will need to keep all the Generics used by the interface, and should import the types used in generics from `@pothos/core`. You can now add any new properties to the interface that your plugin needs. Making new properties optional (`newProp?: TypeOfProp`) is recommended for most use cases.

`index.ts` must contain the following:

1.  A bare import of the global types (`import './global-types';`)

2.  The plugins name, which should be typed as a string literal rather than as a generic string:

`const pluginName = 'example'`

3.  A default export of the plugin name `export default pluginName`

4.  A class that extends BasePlugin: `export class PothosExamplePlugin<Types extends SchemaTypes> extends BasePlugin<Types> {}`

`BasePlugin` and `SchemaTypes` can both be imported from `@pothos/core`

5.  A call to register the plugin: `SchemaBuilder.registerPlugin(pluginName, PothosExamplePlugin);`

`SchemaBuilder` can also be imported from `@pothos/core`

### [Life cycle hooks](https://pothos-graphql.dev/docs/guide/writing-plugins#life-cycle-hooks)

The `SchemaBuilder` will instantiate plugins each time the `toSchema` method is called on the builder. As the schema is built, it will invoke the various life cycle methods on each plugin if they have been defined.

To hook into each lifecycle event, simply define the corresponding function in your plugin class. For the exact function signature, see the `index.ts` of the example plugin.

- `onTypeConfig`: Invoked for each type, with the config object that will be used to construct the underlying GraphQL type.

- `onOutputFieldConfig`: Invoked for each Object, or Interface field, with the config object describing the field.

- `onInputFieldConfig`: Invoked for each InputObject field, or field argument, with the config object describing the field.

- `onEnumValueConfig`: Invoked for each value in an enum

- `beforeBuild`: Invoked before building schemas, last chance to add new types or fields.

- `afterBuild`: Invoked with the fully built Schema.

- `wrapResolve`: Invoked when creating the resolver for each field

- `wrapSubscribe`: Invoked for each field in the `Subscriptions` object.

- `wrapResolveType`: Invoked for each Union and Interface.

Each of the lifecycle methods above (except `beforeBuild`) expect a return value that matches their first argument (either a config object, or the resolve/subscribe/resolveType function). If your plugin does not need to modify these values, it can simple return the value that was passed in. When your plugin does need to change one of the config values, you should return a copy of the config object with your modifications, rather than modifying the config object that was passed in. This can be done by either using `Object.assign`, or spreading the original config into a new object `{...originalConfig, newProp: newValue }`.

Each config object will have the properties expected by the GraphQL for creating the types or fields (although some properties like `resolve` will be added later), but will also include a number of Pothos specific properties. These properties include `graphqlKind` to indicate what kind of GraphQL type the config object is for, `pothosOptions`, which contains all the options passed in to the schema builder when creating the type or field.

If your plugin needs to add additional types or fields to the schema it should do this in the `beforeBuild` hook. Any types added to the schema after this, may not be included correctly. Plugins should also account for the fact that a new instance of the plugin will be created each time the schema is called, so any types or fields added the the schema should only be applied once (per schema), even if multiple instances of the plugin are created. The help with this, there is a `runUnique` helper on the base plugin class, which accepts a key, and a callback, and will only run a callback once per schema for the given key.

Below are a few of the most common use cases for how a plugin might extend the Pothos with very simplified examples. Most plugins will likely need a combination of these strategies, and some uses cases may not be well documented. If you are unsure about how to solve a specific problem, feel free to open a GitHub Issue for more help.

In the examples below, when "extending an interface", the interface should be added to the `PothosSchemaTypes` namespace in `global-types.ts`.

### [Adding options to the SchemaBuilder constructor](https://pothos-graphql.dev/docs/guide/writing-plugins#adding-options-to-the-schemabuilder-constructor)

You may have noticed that plugins are not instantiated by the user, and therefore users can't pass options directly into your plugin when creating it. Instead, the recommended way to configure your plugin is by contributing new properties to the options object passed the the SchemaBuilder constructor. This can be done by extending the `SchemaBuilderOptions` interface.

Extending this interface will allow the user to pass in these new options when creating an instance of `SchemaBuilder`.

You can then access the options through `this.builder.options` in your plugin, with everything correctly typed:

### [Adding options when building a schema (`toSchema`)](https://pothos-graphql.dev/docs/guide/writing-plugins#adding-options-when-building-a-schema-toschema)

In some cases, your plugin may be designed for schemas that be built in different modes. For example the mocks plugin allows the schema to be built repeatedly with different sets of mocks, or the subGraph allows building a schema multiple times to generate separate subgraphs. For these cases, you can extend the options passed to `toSchema` instead:

These options can be accessed through `this.options` in your plugin:

### [Adding options to types](https://pothos-graphql.dev/docs/guide/writing-plugins#adding-options-to-types)

Each GraphQL type has it's own options interface which can be extended. For example, to extend the options for creating an Object type:

These options can then be accessed in your plugin when you receive the config for the type:

In the example above, we need to check `typeConfig.kind` to ensure that the type config is for an object. Without this check, typescript will not know that the config object is for an object, and will not let us access the property. `typeConfig.kind` corresponds to how Pothos splits up Types for its config objects, meaning that it has separate `kind`s for `Query`, `Mutation`, and `Subscription` even though these are all `Objects` in GraphQL terminology. The `typeConfig.graphqlKind` can be used to get the actual GraphQL type instead.

### [Adding options to fields](https://pothos-graphql.dev/docs/guide/writing-plugins#adding-options-to-fields)

Similar to Types, fields also have a number of interfaces that can be extended to add options to various types of fields:

Field interfaces have a few more generics than other interfaces we have looked at. These generics can be used to make the options you add more specific to the field currently being defined. It is important to copy all the generics of the interfaces as they are defined in `@pothos/core` even if you do not use the generics in your own properties. If the generics do not match, typescript won't be able to merge the definitions. You do NOT need to include the `extends` clause of the interface, if the interface extends another interface (like `FieldOptions`).

Similar to Type options, Field options will be available in the fieldConfigs in your plugin, once you check that the fieldConfig is for the correct `kind` of field.

### [Adding new methods on builder classes](https://pothos-graphql.dev/docs/guide/writing-plugins#adding-new-methods-on-builder-classes)

Adding new method to `SchemaBuilder` or one of the `FieldBuilder` classes is also done through extending interfaces. Extending these interfaces is how typescript is able to know these methods exist, even though they are not defined on the original classes.

The above is a simple example of defining a new `buildCustomObject` method that takes no arguments, and returns a reference to a new custom object type. Defining this type will not work on it's own, and we still need to define the actual implementation of this method. This might look like:

Note that the above function does NOT use an arrow function, so that the function can access `this` as a reference the the SchemaBuilder instance.

### [Wrapping resolvers to add runtime functionality](https://pothos-graphql.dev/docs/guide/writing-plugins#wrapping-resolvers-to-add-runtime-functionality)

Some plugins will need to add runtime behavior. There are a few lifecycle hooks for wrapping `resolve`, `subscribe`, and `resolveType`. These hooks will receive the function they are wrapping, along with a config object for the field or type they are associated with, and should return either the original function, or a wrapper function with the same API.

It is important to remember that resolvers can resolve values in a number of ways (normal values, promises, or even something as complicated `Promise<(Promise<T> | T)[]>`. So be careful when using a wrapper that introspected the return value of a resolve function. Plugins should only wrap resolvers when absolutely necessary.

### [Transforming a schema](https://pothos-graphql.dev/docs/guide/writing-plugins#transforming-a-schema)

For some plugins the other provided lifecycle may not be sufficiently powerful to modify the schema in all the ways a plugin may want. For example removing types from the schema (eg. the `SubGraph` plugin). In these cases, the `afterBuild` hook can be used. It receives the built schema, and is expected to return either the schema it was passed, or a completely new schema. This allows plugins to use 3rd party libraries like `graphql-tools` to arbitrarily transform schemas if desired.

### [Using SchemaTypes](https://pothos-graphql.dev/docs/guide/writing-plugins#using-schematypes)

You may have noticed that almost every interface and type in `@pothos/core` take a generic that looks like: `Types extends SchemaTypes`. This type is what allows Pothos and its plugins to share type information across the entire schema, and to incorporate user defined types into that system. These SchemaTypes are a combination of default types merged with the Types provided in the Generic parameter of the SchemaBuilder constructor, and includes a wide variety of useful types:

- Types for all the scalars
- Types for backing models used by objects and interfaces when referenced via strings
- The type used for the context and root objects
- Settings for default nullability of fields
- Any user defined types specific to plugins (more info below)

There are many ways these types can be used, but one of the most common is to access the type for the context object, so that you can correctly type a callback function for your plugin that accepts the context object.

### [Using user defined types](https://pothos-graphql.dev/docs/guide/writing-plugins#using-user-defined-types)

As mentioned above, your plugin can also contribute its own user definable types to the SchemaTypes interface. You can see examples of this in the several of the plugins including the directives and `scope-auth` plugins. Adding your own types to SchemaTypes requires extending 2 interfaces: The `UserSchemaTypes` which describes the user provided type will need to extend, and the `ExtendDefaultTypes` interface, which is used to set default values if the User does not provide their own types.

The User provided type can then be accessed using `Types['NewExampleTypes']` in any interface or type that receive `SchemaTypes` as a generic argument.

### [Request data](https://pothos-graphql.dev/docs/guide/writing-plugins#request-data)

Plugins that wrap resolvers may need to store some data that us unique the current request. In these cases your plugin can define a `createRequestData` method, and use the `requestData` method to get the data for the current request.

The shape of requestData can be defined via the second generic parameter of the `BasePlugin` class. The `requestData` method expects the context object as its only argument, which is used to uniquely identify the current request.

### [Wrapping arguments and inputs](https://pothos-graphql.dev/docs/guide/writing-plugins#wrapping-arguments-and-inputs)

The plugin API does not directly have a method for wrapping input fields, instead, the `wrapResolve` and `wrapSubscribe` methods can be used to modify the `args` object before passing it down to the original resolver.

Figuring out how to wrap inputs can be a little complex, especially when dealing with recursive inputs, and optimizing to wrap as little as possible. To help with this, Pothos has a couple of utility functions that can make this easier:

- `mapInputFields`: Used to select affected input fields and extract some configuration
- `createInputValueMapper`: Creates a mapping function that uses the result of `mapInputFields` to map inputs in an args object to new values.

The relay plugin uses these methods to decode `globalID` inputs:

Using these utilities allows moving more logic to build time (figuring out which fields need mapping) so that the runtime overhead is as small as possible.

`createInputValueMapper` may be useful for some use cases, for some plugins it may be better to create a custom mapping function, but still use the result of `mapInputFields`.

`mapInputFields` returns a map who's keys are field/argument names, and who's values are objects with the following shape:

if the `kind` is `InputObject` then the mapping object will also have a fields property with an object of the following shape:

Both the root level map, and the `fields.map` maps will only contain entries for fields where the mapping function did not return null. If the mapping function returned null for all fields, the `mapInputFields` will return null instead of returning a map to indicate no wrapping should occur

### [Removing fields and enum values](https://pothos-graphql.dev/docs/guide/writing-plugins#removing-fields-and-enum-values)

Plugins can remove fields from objects, interfaces, and input objects, and remove specific values from enums. To do this, simply return null from the corresponding on\*Config plugin hook:

Removing whole types from the schema needs to be done by transforming the schema during the `afterBuild` hook. See the `sub-graph` plugin for a more complete example of removing types.

- `builder.configStore.onTypeConfig`: Takes a type ref and a callback, and will invoke the callback with the config for the referenced type once available.

- `fieldRef.onFirstUse` Takes a callback to invoke once the config for the field is available.

- `buildCache.getTypeConfig` Gets the config for a given type after it has been passed through any modifications applied by plugins.

---

## URL: https://pothos-graphql.dev/docs/guide/writing-plugins#life-cycle-hooks

Title: Writing plugins

URL Source: https://pothos-graphql.dev/docs/guide/writing-plugins

Markdown Content:
Writing plugins for Pothos may seem a little intimidating at first, because the types used by Pothos are fairly complex. Fortunately, for many types of plugins, the process is actually pretty easy, once you understand the core concepts of how Pothos's type system works. Don't worry if the descriptions don't make complete sense at first. Going through the examples in this guide will hopefully make things seem a lot easier. This guide aims to cover a lot of the most common use cases for creating plugins, but does not contain full API documentation. Exploring the types or source code to see what all is available is highly encouraged, but should not be required for most use cases.

Pothos has 2 main pieces to it's type system:

1.  `PothosSchemaTypes`: A global namespace for shared types
2.  `SchemaTypes`: A collection of types passed around through Generics specific to each instance of `SchemaBuilder`

### [`PothosSchemaTypes`](https://pothos-graphql.dev/docs/guide/writing-plugins#pothosschematypes)

The `PothosSchemaTypes` contains interfaces for all the various options objects used throughout the API, along with some other types that plugins may want to extend. Each of the interfaces can be extended by a plugin to add new options. Each interface takes a number of relevant generic parameters that can be used to make the options more useful. For example, the interface for field options will be passed the shape of the parent, the expected return type, and any arguments.

### [`SchemaTypes`](https://pothos-graphql.dev/docs/guide/writing-plugins#schematypes)

The `SchemaTypes` type is based on the Generic argument passed to the `SchemaBuilder`, and extended with reasonable defaults. Almost every interface in the `PothosSchemaTypes` will have access to it (look for `Types extends SchemaTypes` in the generics of almost any interface). This Type contains the types for Scalars, backing models for some object and interface types, and many custom properties from various plugins. If your plugin needs the user to provide some types that will be shared across the whole schema, this is how you will be able to access them when adding fields to the options objects defined in `PothosSchemaTypes`.

The best place to start is by looking through the [example plugin](https://github.com/hayes/pothos/tree/main/packages/plugin-example).

The general structure of a plugin has 3 main parts:

1.  `index.ts` which contains a plugins actual implementation
2.  `global-types.ts` which contains any additions to `Pothos`s built in types.
3.  `types.ts` which should contain any types that do NOT belong to the global `PothosSchemaTypes` namespace.

To get set up quickly, you can copy these files from the example plugin to suit your needs. The first few things to change are:

1.  The plugin name in `index.ts`
2.  The name of the Plugin class in `index.ts`
3.  The name key/name for the plugin in the `Plugins` interface in `global-types.ts`

After setting up the basic layout of your plugin, I recommend starting by defining the types for your plugin first (in `global-types.ts`) and setting up a test schema that uses your plugin. This allows you to get the user facing API for your plugin working first, so you can see that any new options you add to the API are working as expected, and that any type constraints are enforced correctly. Once you are happy with your API, you can start building out the functionality in index.ts. Building the types first also make the implementation easier because the properties you will need to access in your extension may not exist on the config objects until you have defined your types.

### [`global-types.ts`](https://pothos-graphql.dev/docs/guide/writing-plugins#global-typests)

`global-types.ts` must contain the following:

1.  A declaration of the `PothosSchemaTypes` namespace

2.  An addition to the `Plugins` interface that maps the plugin name, to the plugin type (this needs to be inside the `PothosSchemaTypes` namespace)

`global-types.ts` should NOT include definitions that do not belong to the `PothosSchemaTypes` namespace. Types for your plugin should be added to a separate `types.ts` file, and imported as needed into `global-types.ts`.

To add properties to the various config objects used by the `SchemaBuilder`, you should start by finding the interface that defines that config object in `@pothos/core`. Currently there are 4 main file that define the types that make up `PothosSchemaTypes` namespace.

1.  [`type-options.ts`](https://github.com/hayes/pothos/blob/main/packages/core/src/types/global/type-options.ts):

Contains the interfaces that define the options objects for the various types (Object, Interface, Enum, etc).

2.  [`field-options.ts`](https://github.com/hayes/pothos/blob/main/packages/core/src/types/global/field-options.ts):

Contains the interfaces that define the options objects for creating fields

3.  [`schema-types.ts`](https://github.com/hayes/pothos/blob/main/packages/core/src/types/global/schema-types.ts):

Contains the interfaces for SchemaBuilder options, SchemaTypes, options for `toSchema`, and other utility interfaces that may be useful for plugins to extend that do not fall into one of the other categories.

4.  [`classes.ts`](https://github.com/hayes/pothos/blob/main/packages/core/src/types/global/classes.ts):

Contains interfaces that describe the classes used by Pothos, include `SchemaBuilder` and the various field builder classes.

Once you have identified a type you wish to extend, copy it into the `PothosSchemaTypes` namespace in your `global-types.ts`, but remove all the existing properties. You will need to keep all the Generics used by the interface, and should import the types used in generics from `@pothos/core`. You can now add any new properties to the interface that your plugin needs. Making new properties optional (`newProp?: TypeOfProp`) is recommended for most use cases.

`index.ts` must contain the following:

1.  A bare import of the global types (`import './global-types';`)

2.  The plugins name, which should be typed as a string literal rather than as a generic string:

`const pluginName = 'example'`

3.  A default export of the plugin name `export default pluginName`

4.  A class that extends BasePlugin: `export class PothosExamplePlugin<Types extends SchemaTypes> extends BasePlugin<Types> {}`

`BasePlugin` and `SchemaTypes` can both be imported from `@pothos/core`

5.  A call to register the plugin: `SchemaBuilder.registerPlugin(pluginName, PothosExamplePlugin);`

`SchemaBuilder` can also be imported from `@pothos/core`

### [Life cycle hooks](https://pothos-graphql.dev/docs/guide/writing-plugins#life-cycle-hooks)

The `SchemaBuilder` will instantiate plugins each time the `toSchema` method is called on the builder. As the schema is built, it will invoke the various life cycle methods on each plugin if they have been defined.

To hook into each lifecycle event, simply define the corresponding function in your plugin class. For the exact function signature, see the `index.ts` of the example plugin.

- `onTypeConfig`: Invoked for each type, with the config object that will be used to construct the underlying GraphQL type.

- `onOutputFieldConfig`: Invoked for each Object, or Interface field, with the config object describing the field.

- `onInputFieldConfig`: Invoked for each InputObject field, or field argument, with the config object describing the field.

- `onEnumValueConfig`: Invoked for each value in an enum

- `beforeBuild`: Invoked before building schemas, last chance to add new types or fields.

- `afterBuild`: Invoked with the fully built Schema.

- `wrapResolve`: Invoked when creating the resolver for each field

- `wrapSubscribe`: Invoked for each field in the `Subscriptions` object.

- `wrapResolveType`: Invoked for each Union and Interface.

Each of the lifecycle methods above (except `beforeBuild`) expect a return value that matches their first argument (either a config object, or the resolve/subscribe/resolveType function). If your plugin does not need to modify these values, it can simple return the value that was passed in. When your plugin does need to change one of the config values, you should return a copy of the config object with your modifications, rather than modifying the config object that was passed in. This can be done by either using `Object.assign`, or spreading the original config into a new object `{...originalConfig, newProp: newValue }`.

Each config object will have the properties expected by the GraphQL for creating the types or fields (although some properties like `resolve` will be added later), but will also include a number of Pothos specific properties. These properties include `graphqlKind` to indicate what kind of GraphQL type the config object is for, `pothosOptions`, which contains all the options passed in to the schema builder when creating the type or field.

If your plugin needs to add additional types or fields to the schema it should do this in the `beforeBuild` hook. Any types added to the schema after this, may not be included correctly. Plugins should also account for the fact that a new instance of the plugin will be created each time the schema is called, so any types or fields added the the schema should only be applied once (per schema), even if multiple instances of the plugin are created. The help with this, there is a `runUnique` helper on the base plugin class, which accepts a key, and a callback, and will only run a callback once per schema for the given key.

Below are a few of the most common use cases for how a plugin might extend the Pothos with very simplified examples. Most plugins will likely need a combination of these strategies, and some uses cases may not be well documented. If you are unsure about how to solve a specific problem, feel free to open a GitHub Issue for more help.

In the examples below, when "extending an interface", the interface should be added to the `PothosSchemaTypes` namespace in `global-types.ts`.

### [Adding options to the SchemaBuilder constructor](https://pothos-graphql.dev/docs/guide/writing-plugins#adding-options-to-the-schemabuilder-constructor)

You may have noticed that plugins are not instantiated by the user, and therefore users can't pass options directly into your plugin when creating it. Instead, the recommended way to configure your plugin is by contributing new properties to the options object passed the the SchemaBuilder constructor. This can be done by extending the `SchemaBuilderOptions` interface.

Extending this interface will allow the user to pass in these new options when creating an instance of `SchemaBuilder`.

You can then access the options through `this.builder.options` in your plugin, with everything correctly typed:

### [Adding options when building a schema (`toSchema`)](https://pothos-graphql.dev/docs/guide/writing-plugins#adding-options-when-building-a-schema-toschema)

In some cases, your plugin may be designed for schemas that be built in different modes. For example the mocks plugin allows the schema to be built repeatedly with different sets of mocks, or the subGraph allows building a schema multiple times to generate separate subgraphs. For these cases, you can extend the options passed to `toSchema` instead:

These options can be accessed through `this.options` in your plugin:

### [Adding options to types](https://pothos-graphql.dev/docs/guide/writing-plugins#adding-options-to-types)

Each GraphQL type has it's own options interface which can be extended. For example, to extend the options for creating an Object type:

These options can then be accessed in your plugin when you receive the config for the type:

In the example above, we need to check `typeConfig.kind` to ensure that the type config is for an object. Without this check, typescript will not know that the config object is for an object, and will not let us access the property. `typeConfig.kind` corresponds to how Pothos splits up Types for its config objects, meaning that it has separate `kind`s for `Query`, `Mutation`, and `Subscription` even though these are all `Objects` in GraphQL terminology. The `typeConfig.graphqlKind` can be used to get the actual GraphQL type instead.

### [Adding options to fields](https://pothos-graphql.dev/docs/guide/writing-plugins#adding-options-to-fields)

Similar to Types, fields also have a number of interfaces that can be extended to add options to various types of fields:

Field interfaces have a few more generics than other interfaces we have looked at. These generics can be used to make the options you add more specific to the field currently being defined. It is important to copy all the generics of the interfaces as they are defined in `@pothos/core` even if you do not use the generics in your own properties. If the generics do not match, typescript won't be able to merge the definitions. You do NOT need to include the `extends` clause of the interface, if the interface extends another interface (like `FieldOptions`).

Similar to Type options, Field options will be available in the fieldConfigs in your plugin, once you check that the fieldConfig is for the correct `kind` of field.

### [Adding new methods on builder classes](https://pothos-graphql.dev/docs/guide/writing-plugins#adding-new-methods-on-builder-classes)

Adding new method to `SchemaBuilder` or one of the `FieldBuilder` classes is also done through extending interfaces. Extending these interfaces is how typescript is able to know these methods exist, even though they are not defined on the original classes.

The above is a simple example of defining a new `buildCustomObject` method that takes no arguments, and returns a reference to a new custom object type. Defining this type will not work on it's own, and we still need to define the actual implementation of this method. This might look like:

Note that the above function does NOT use an arrow function, so that the function can access `this` as a reference the the SchemaBuilder instance.

### [Wrapping resolvers to add runtime functionality](https://pothos-graphql.dev/docs/guide/writing-plugins#wrapping-resolvers-to-add-runtime-functionality)

Some plugins will need to add runtime behavior. There are a few lifecycle hooks for wrapping `resolve`, `subscribe`, and `resolveType`. These hooks will receive the function they are wrapping, along with a config object for the field or type they are associated with, and should return either the original function, or a wrapper function with the same API.

It is important to remember that resolvers can resolve values in a number of ways (normal values, promises, or even something as complicated `Promise<(Promise<T> | T)[]>`. So be careful when using a wrapper that introspected the return value of a resolve function. Plugins should only wrap resolvers when absolutely necessary.

### [Transforming a schema](https://pothos-graphql.dev/docs/guide/writing-plugins#transforming-a-schema)

For some plugins the other provided lifecycle may not be sufficiently powerful to modify the schema in all the ways a plugin may want. For example removing types from the schema (eg. the `SubGraph` plugin). In these cases, the `afterBuild` hook can be used. It receives the built schema, and is expected to return either the schema it was passed, or a completely new schema. This allows plugins to use 3rd party libraries like `graphql-tools` to arbitrarily transform schemas if desired.

### [Using SchemaTypes](https://pothos-graphql.dev/docs/guide/writing-plugins#using-schematypes)

You may have noticed that almost every interface and type in `@pothos/core` take a generic that looks like: `Types extends SchemaTypes`. This type is what allows Pothos and its plugins to share type information across the entire schema, and to incorporate user defined types into that system. These SchemaTypes are a combination of default types merged with the Types provided in the Generic parameter of the SchemaBuilder constructor, and includes a wide variety of useful types:

- Types for all the scalars
- Types for backing models used by objects and interfaces when referenced via strings
- The type used for the context and root objects
- Settings for default nullability of fields
- Any user defined types specific to plugins (more info below)

There are many ways these types can be used, but one of the most common is to access the type for the context object, so that you can correctly type a callback function for your plugin that accepts the context object.

### [Using user defined types](https://pothos-graphql.dev/docs/guide/writing-plugins#using-user-defined-types)

As mentioned above, your plugin can also contribute its own user definable types to the SchemaTypes interface. You can see examples of this in the several of the plugins including the directives and `scope-auth` plugins. Adding your own types to SchemaTypes requires extending 2 interfaces: The `UserSchemaTypes` which describes the user provided type will need to extend, and the `ExtendDefaultTypes` interface, which is used to set default values if the User does not provide their own types.

The User provided type can then be accessed using `Types['NewExampleTypes']` in any interface or type that receive `SchemaTypes` as a generic argument.

### [Request data](https://pothos-graphql.dev/docs/guide/writing-plugins#request-data)

Plugins that wrap resolvers may need to store some data that us unique the current request. In these cases your plugin can define a `createRequestData` method, and use the `requestData` method to get the data for the current request.

The shape of requestData can be defined via the second generic parameter of the `BasePlugin` class. The `requestData` method expects the context object as its only argument, which is used to uniquely identify the current request.

### [Wrapping arguments and inputs](https://pothos-graphql.dev/docs/guide/writing-plugins#wrapping-arguments-and-inputs)

The plugin API does not directly have a method for wrapping input fields, instead, the `wrapResolve` and `wrapSubscribe` methods can be used to modify the `args` object before passing it down to the original resolver.

Figuring out how to wrap inputs can be a little complex, especially when dealing with recursive inputs, and optimizing to wrap as little as possible. To help with this, Pothos has a couple of utility functions that can make this easier:

- `mapInputFields`: Used to select affected input fields and extract some configuration
- `createInputValueMapper`: Creates a mapping function that uses the result of `mapInputFields` to map inputs in an args object to new values.

The relay plugin uses these methods to decode `globalID` inputs:

Using these utilities allows moving more logic to build time (figuring out which fields need mapping) so that the runtime overhead is as small as possible.

`createInputValueMapper` may be useful for some use cases, for some plugins it may be better to create a custom mapping function, but still use the result of `mapInputFields`.

`mapInputFields` returns a map who's keys are field/argument names, and who's values are objects with the following shape:

if the `kind` is `InputObject` then the mapping object will also have a fields property with an object of the following shape:

Both the root level map, and the `fields.map` maps will only contain entries for fields where the mapping function did not return null. If the mapping function returned null for all fields, the `mapInputFields` will return null instead of returning a map to indicate no wrapping should occur

### [Removing fields and enum values](https://pothos-graphql.dev/docs/guide/writing-plugins#removing-fields-and-enum-values)

Plugins can remove fields from objects, interfaces, and input objects, and remove specific values from enums. To do this, simply return null from the corresponding on\*Config plugin hook:

Removing whole types from the schema needs to be done by transforming the schema during the `afterBuild` hook. See the `sub-graph` plugin for a more complete example of removing types.

- `builder.configStore.onTypeConfig`: Takes a type ref and a callback, and will invoke the callback with the config for the referenced type once available.

- `fieldRef.onFirstUse` Takes a callback to invoke once the config for the field is available.

- `buildCache.getTypeConfig` Gets the config for a given type after it has been passed through any modifications applied by plugins.

---

## URL: https://pothos-graphql.dev/docs/guide/writing-plugins#adding-options-to-the-schemabuilder-constructor

Title: Writing plugins

URL Source: https://pothos-graphql.dev/docs/guide/writing-plugins

Markdown Content:
Writing plugins for Pothos may seem a little intimidating at first, because the types used by Pothos are fairly complex. Fortunately, for many types of plugins, the process is actually pretty easy, once you understand the core concepts of how Pothos's type system works. Don't worry if the descriptions don't make complete sense at first. Going through the examples in this guide will hopefully make things seem a lot easier. This guide aims to cover a lot of the most common use cases for creating plugins, but does not contain full API documentation. Exploring the types or source code to see what all is available is highly encouraged, but should not be required for most use cases.

Pothos has 2 main pieces to it's type system:

1.  `PothosSchemaTypes`: A global namespace for shared types
2.  `SchemaTypes`: A collection of types passed around through Generics specific to each instance of `SchemaBuilder`

### [`PothosSchemaTypes`](https://pothos-graphql.dev/docs/guide/writing-plugins#pothosschematypes)

The `PothosSchemaTypes` contains interfaces for all the various options objects used throughout the API, along with some other types that plugins may want to extend. Each of the interfaces can be extended by a plugin to add new options. Each interface takes a number of relevant generic parameters that can be used to make the options more useful. For example, the interface for field options will be passed the shape of the parent, the expected return type, and any arguments.

### [`SchemaTypes`](https://pothos-graphql.dev/docs/guide/writing-plugins#schematypes)

The `SchemaTypes` type is based on the Generic argument passed to the `SchemaBuilder`, and extended with reasonable defaults. Almost every interface in the `PothosSchemaTypes` will have access to it (look for `Types extends SchemaTypes` in the generics of almost any interface). This Type contains the types for Scalars, backing models for some object and interface types, and many custom properties from various plugins. If your plugin needs the user to provide some types that will be shared across the whole schema, this is how you will be able to access them when adding fields to the options objects defined in `PothosSchemaTypes`.

The best place to start is by looking through the [example plugin](https://github.com/hayes/pothos/tree/main/packages/plugin-example).

The general structure of a plugin has 3 main parts:

1.  `index.ts` which contains a plugins actual implementation
2.  `global-types.ts` which contains any additions to `Pothos`s built in types.
3.  `types.ts` which should contain any types that do NOT belong to the global `PothosSchemaTypes` namespace.

To get set up quickly, you can copy these files from the example plugin to suit your needs. The first few things to change are:

1.  The plugin name in `index.ts`
2.  The name of the Plugin class in `index.ts`
3.  The name key/name for the plugin in the `Plugins` interface in `global-types.ts`

After setting up the basic layout of your plugin, I recommend starting by defining the types for your plugin first (in `global-types.ts`) and setting up a test schema that uses your plugin. This allows you to get the user facing API for your plugin working first, so you can see that any new options you add to the API are working as expected, and that any type constraints are enforced correctly. Once you are happy with your API, you can start building out the functionality in index.ts. Building the types first also make the implementation easier because the properties you will need to access in your extension may not exist on the config objects until you have defined your types.

### [`global-types.ts`](https://pothos-graphql.dev/docs/guide/writing-plugins#global-typests)

`global-types.ts` must contain the following:

1.  A declaration of the `PothosSchemaTypes` namespace

2.  An addition to the `Plugins` interface that maps the plugin name, to the plugin type (this needs to be inside the `PothosSchemaTypes` namespace)

`global-types.ts` should NOT include definitions that do not belong to the `PothosSchemaTypes` namespace. Types for your plugin should be added to a separate `types.ts` file, and imported as needed into `global-types.ts`.

To add properties to the various config objects used by the `SchemaBuilder`, you should start by finding the interface that defines that config object in `@pothos/core`. Currently there are 4 main file that define the types that make up `PothosSchemaTypes` namespace.

1.  [`type-options.ts`](https://github.com/hayes/pothos/blob/main/packages/core/src/types/global/type-options.ts):

Contains the interfaces that define the options objects for the various types (Object, Interface, Enum, etc).

2.  [`field-options.ts`](https://github.com/hayes/pothos/blob/main/packages/core/src/types/global/field-options.ts):

Contains the interfaces that define the options objects for creating fields

3.  [`schema-types.ts`](https://github.com/hayes/pothos/blob/main/packages/core/src/types/global/schema-types.ts):

Contains the interfaces for SchemaBuilder options, SchemaTypes, options for `toSchema`, and other utility interfaces that may be useful for plugins to extend that do not fall into one of the other categories.

4.  [`classes.ts`](https://github.com/hayes/pothos/blob/main/packages/core/src/types/global/classes.ts):

Contains interfaces that describe the classes used by Pothos, include `SchemaBuilder` and the various field builder classes.

Once you have identified a type you wish to extend, copy it into the `PothosSchemaTypes` namespace in your `global-types.ts`, but remove all the existing properties. You will need to keep all the Generics used by the interface, and should import the types used in generics from `@pothos/core`. You can now add any new properties to the interface that your plugin needs. Making new properties optional (`newProp?: TypeOfProp`) is recommended for most use cases.

`index.ts` must contain the following:

1.  A bare import of the global types (`import './global-types';`)

2.  The plugins name, which should be typed as a string literal rather than as a generic string:

`const pluginName = 'example'`

3.  A default export of the plugin name `export default pluginName`

4.  A class that extends BasePlugin: `export class PothosExamplePlugin<Types extends SchemaTypes> extends BasePlugin<Types> {}`

`BasePlugin` and `SchemaTypes` can both be imported from `@pothos/core`

5.  A call to register the plugin: `SchemaBuilder.registerPlugin(pluginName, PothosExamplePlugin);`

`SchemaBuilder` can also be imported from `@pothos/core`

### [Life cycle hooks](https://pothos-graphql.dev/docs/guide/writing-plugins#life-cycle-hooks)

The `SchemaBuilder` will instantiate plugins each time the `toSchema` method is called on the builder. As the schema is built, it will invoke the various life cycle methods on each plugin if they have been defined.

To hook into each lifecycle event, simply define the corresponding function in your plugin class. For the exact function signature, see the `index.ts` of the example plugin.

- `onTypeConfig`: Invoked for each type, with the config object that will be used to construct the underlying GraphQL type.

- `onOutputFieldConfig`: Invoked for each Object, or Interface field, with the config object describing the field.

- `onInputFieldConfig`: Invoked for each InputObject field, or field argument, with the config object describing the field.

- `onEnumValueConfig`: Invoked for each value in an enum

- `beforeBuild`: Invoked before building schemas, last chance to add new types or fields.

- `afterBuild`: Invoked with the fully built Schema.

- `wrapResolve`: Invoked when creating the resolver for each field

- `wrapSubscribe`: Invoked for each field in the `Subscriptions` object.

- `wrapResolveType`: Invoked for each Union and Interface.

Each of the lifecycle methods above (except `beforeBuild`) expect a return value that matches their first argument (either a config object, or the resolve/subscribe/resolveType function). If your plugin does not need to modify these values, it can simple return the value that was passed in. When your plugin does need to change one of the config values, you should return a copy of the config object with your modifications, rather than modifying the config object that was passed in. This can be done by either using `Object.assign`, or spreading the original config into a new object `{...originalConfig, newProp: newValue }`.

Each config object will have the properties expected by the GraphQL for creating the types or fields (although some properties like `resolve` will be added later), but will also include a number of Pothos specific properties. These properties include `graphqlKind` to indicate what kind of GraphQL type the config object is for, `pothosOptions`, which contains all the options passed in to the schema builder when creating the type or field.

If your plugin needs to add additional types or fields to the schema it should do this in the `beforeBuild` hook. Any types added to the schema after this, may not be included correctly. Plugins should also account for the fact that a new instance of the plugin will be created each time the schema is called, so any types or fields added the the schema should only be applied once (per schema), even if multiple instances of the plugin are created. The help with this, there is a `runUnique` helper on the base plugin class, which accepts a key, and a callback, and will only run a callback once per schema for the given key.

Below are a few of the most common use cases for how a plugin might extend the Pothos with very simplified examples. Most plugins will likely need a combination of these strategies, and some uses cases may not be well documented. If you are unsure about how to solve a specific problem, feel free to open a GitHub Issue for more help.

In the examples below, when "extending an interface", the interface should be added to the `PothosSchemaTypes` namespace in `global-types.ts`.

### [Adding options to the SchemaBuilder constructor](https://pothos-graphql.dev/docs/guide/writing-plugins#adding-options-to-the-schemabuilder-constructor)

You may have noticed that plugins are not instantiated by the user, and therefore users can't pass options directly into your plugin when creating it. Instead, the recommended way to configure your plugin is by contributing new properties to the options object passed the the SchemaBuilder constructor. This can be done by extending the `SchemaBuilderOptions` interface.

Extending this interface will allow the user to pass in these new options when creating an instance of `SchemaBuilder`.

You can then access the options through `this.builder.options` in your plugin, with everything correctly typed:

### [Adding options when building a schema (`toSchema`)](https://pothos-graphql.dev/docs/guide/writing-plugins#adding-options-when-building-a-schema-toschema)

In some cases, your plugin may be designed for schemas that be built in different modes. For example the mocks plugin allows the schema to be built repeatedly with different sets of mocks, or the subGraph allows building a schema multiple times to generate separate subgraphs. For these cases, you can extend the options passed to `toSchema` instead:

These options can be accessed through `this.options` in your plugin:

### [Adding options to types](https://pothos-graphql.dev/docs/guide/writing-plugins#adding-options-to-types)

Each GraphQL type has it's own options interface which can be extended. For example, to extend the options for creating an Object type:

These options can then be accessed in your plugin when you receive the config for the type:

In the example above, we need to check `typeConfig.kind` to ensure that the type config is for an object. Without this check, typescript will not know that the config object is for an object, and will not let us access the property. `typeConfig.kind` corresponds to how Pothos splits up Types for its config objects, meaning that it has separate `kind`s for `Query`, `Mutation`, and `Subscription` even though these are all `Objects` in GraphQL terminology. The `typeConfig.graphqlKind` can be used to get the actual GraphQL type instead.

### [Adding options to fields](https://pothos-graphql.dev/docs/guide/writing-plugins#adding-options-to-fields)

Similar to Types, fields also have a number of interfaces that can be extended to add options to various types of fields:

Field interfaces have a few more generics than other interfaces we have looked at. These generics can be used to make the options you add more specific to the field currently being defined. It is important to copy all the generics of the interfaces as they are defined in `@pothos/core` even if you do not use the generics in your own properties. If the generics do not match, typescript won't be able to merge the definitions. You do NOT need to include the `extends` clause of the interface, if the interface extends another interface (like `FieldOptions`).

Similar to Type options, Field options will be available in the fieldConfigs in your plugin, once you check that the fieldConfig is for the correct `kind` of field.

### [Adding new methods on builder classes](https://pothos-graphql.dev/docs/guide/writing-plugins#adding-new-methods-on-builder-classes)

Adding new method to `SchemaBuilder` or one of the `FieldBuilder` classes is also done through extending interfaces. Extending these interfaces is how typescript is able to know these methods exist, even though they are not defined on the original classes.

The above is a simple example of defining a new `buildCustomObject` method that takes no arguments, and returns a reference to a new custom object type. Defining this type will not work on it's own, and we still need to define the actual implementation of this method. This might look like:

Note that the above function does NOT use an arrow function, so that the function can access `this` as a reference the the SchemaBuilder instance.

### [Wrapping resolvers to add runtime functionality](https://pothos-graphql.dev/docs/guide/writing-plugins#wrapping-resolvers-to-add-runtime-functionality)

Some plugins will need to add runtime behavior. There are a few lifecycle hooks for wrapping `resolve`, `subscribe`, and `resolveType`. These hooks will receive the function they are wrapping, along with a config object for the field or type they are associated with, and should return either the original function, or a wrapper function with the same API.

It is important to remember that resolvers can resolve values in a number of ways (normal values, promises, or even something as complicated `Promise<(Promise<T> | T)[]>`. So be careful when using a wrapper that introspected the return value of a resolve function. Plugins should only wrap resolvers when absolutely necessary.

### [Transforming a schema](https://pothos-graphql.dev/docs/guide/writing-plugins#transforming-a-schema)

For some plugins the other provided lifecycle may not be sufficiently powerful to modify the schema in all the ways a plugin may want. For example removing types from the schema (eg. the `SubGraph` plugin). In these cases, the `afterBuild` hook can be used. It receives the built schema, and is expected to return either the schema it was passed, or a completely new schema. This allows plugins to use 3rd party libraries like `graphql-tools` to arbitrarily transform schemas if desired.

### [Using SchemaTypes](https://pothos-graphql.dev/docs/guide/writing-plugins#using-schematypes)

You may have noticed that almost every interface and type in `@pothos/core` take a generic that looks like: `Types extends SchemaTypes`. This type is what allows Pothos and its plugins to share type information across the entire schema, and to incorporate user defined types into that system. These SchemaTypes are a combination of default types merged with the Types provided in the Generic parameter of the SchemaBuilder constructor, and includes a wide variety of useful types:

- Types for all the scalars
- Types for backing models used by objects and interfaces when referenced via strings
- The type used for the context and root objects
- Settings for default nullability of fields
- Any user defined types specific to plugins (more info below)

There are many ways these types can be used, but one of the most common is to access the type for the context object, so that you can correctly type a callback function for your plugin that accepts the context object.

### [Using user defined types](https://pothos-graphql.dev/docs/guide/writing-plugins#using-user-defined-types)

As mentioned above, your plugin can also contribute its own user definable types to the SchemaTypes interface. You can see examples of this in the several of the plugins including the directives and `scope-auth` plugins. Adding your own types to SchemaTypes requires extending 2 interfaces: The `UserSchemaTypes` which describes the user provided type will need to extend, and the `ExtendDefaultTypes` interface, which is used to set default values if the User does not provide their own types.

The User provided type can then be accessed using `Types['NewExampleTypes']` in any interface or type that receive `SchemaTypes` as a generic argument.

### [Request data](https://pothos-graphql.dev/docs/guide/writing-plugins#request-data)

Plugins that wrap resolvers may need to store some data that us unique the current request. In these cases your plugin can define a `createRequestData` method, and use the `requestData` method to get the data for the current request.

The shape of requestData can be defined via the second generic parameter of the `BasePlugin` class. The `requestData` method expects the context object as its only argument, which is used to uniquely identify the current request.

### [Wrapping arguments and inputs](https://pothos-graphql.dev/docs/guide/writing-plugins#wrapping-arguments-and-inputs)

The plugin API does not directly have a method for wrapping input fields, instead, the `wrapResolve` and `wrapSubscribe` methods can be used to modify the `args` object before passing it down to the original resolver.

Figuring out how to wrap inputs can be a little complex, especially when dealing with recursive inputs, and optimizing to wrap as little as possible. To help with this, Pothos has a couple of utility functions that can make this easier:

- `mapInputFields`: Used to select affected input fields and extract some configuration
- `createInputValueMapper`: Creates a mapping function that uses the result of `mapInputFields` to map inputs in an args object to new values.

The relay plugin uses these methods to decode `globalID` inputs:

Using these utilities allows moving more logic to build time (figuring out which fields need mapping) so that the runtime overhead is as small as possible.

`createInputValueMapper` may be useful for some use cases, for some plugins it may be better to create a custom mapping function, but still use the result of `mapInputFields`.

`mapInputFields` returns a map who's keys are field/argument names, and who's values are objects with the following shape:

if the `kind` is `InputObject` then the mapping object will also have a fields property with an object of the following shape:

Both the root level map, and the `fields.map` maps will only contain entries for fields where the mapping function did not return null. If the mapping function returned null for all fields, the `mapInputFields` will return null instead of returning a map to indicate no wrapping should occur

### [Removing fields and enum values](https://pothos-graphql.dev/docs/guide/writing-plugins#removing-fields-and-enum-values)

Plugins can remove fields from objects, interfaces, and input objects, and remove specific values from enums. To do this, simply return null from the corresponding on\*Config plugin hook:

Removing whole types from the schema needs to be done by transforming the schema during the `afterBuild` hook. See the `sub-graph` plugin for a more complete example of removing types.

- `builder.configStore.onTypeConfig`: Takes a type ref and a callback, and will invoke the callback with the config for the referenced type once available.

- `fieldRef.onFirstUse` Takes a callback to invoke once the config for the field is available.

- `buildCache.getTypeConfig` Gets the config for a given type after it has been passed through any modifications applied by plugins.

---

## URL: https://pothos-graphql.dev/docs/guide/writing-plugins#transforming-a-schema

Title: Writing plugins

URL Source: https://pothos-graphql.dev/docs/guide/writing-plugins

Markdown Content:
Writing plugins for Pothos may seem a little intimidating at first, because the types used by Pothos are fairly complex. Fortunately, for many types of plugins, the process is actually pretty easy, once you understand the core concepts of how Pothos's type system works. Don't worry if the descriptions don't make complete sense at first. Going through the examples in this guide will hopefully make things seem a lot easier. This guide aims to cover a lot of the most common use cases for creating plugins, but does not contain full API documentation. Exploring the types or source code to see what all is available is highly encouraged, but should not be required for most use cases.

Pothos has 2 main pieces to it's type system:

1.  `PothosSchemaTypes`: A global namespace for shared types
2.  `SchemaTypes`: A collection of types passed around through Generics specific to each instance of `SchemaBuilder`

### [`PothosSchemaTypes`](https://pothos-graphql.dev/docs/guide/writing-plugins#pothosschematypes)

The `PothosSchemaTypes` contains interfaces for all the various options objects used throughout the API, along with some other types that plugins may want to extend. Each of the interfaces can be extended by a plugin to add new options. Each interface takes a number of relevant generic parameters that can be used to make the options more useful. For example, the interface for field options will be passed the shape of the parent, the expected return type, and any arguments.

### [`SchemaTypes`](https://pothos-graphql.dev/docs/guide/writing-plugins#schematypes)

The `SchemaTypes` type is based on the Generic argument passed to the `SchemaBuilder`, and extended with reasonable defaults. Almost every interface in the `PothosSchemaTypes` will have access to it (look for `Types extends SchemaTypes` in the generics of almost any interface). This Type contains the types for Scalars, backing models for some object and interface types, and many custom properties from various plugins. If your plugin needs the user to provide some types that will be shared across the whole schema, this is how you will be able to access them when adding fields to the options objects defined in `PothosSchemaTypes`.

The best place to start is by looking through the [example plugin](https://github.com/hayes/pothos/tree/main/packages/plugin-example).

The general structure of a plugin has 3 main parts:

1.  `index.ts` which contains a plugins actual implementation
2.  `global-types.ts` which contains any additions to `Pothos`s built in types.
3.  `types.ts` which should contain any types that do NOT belong to the global `PothosSchemaTypes` namespace.

To get set up quickly, you can copy these files from the example plugin to suit your needs. The first few things to change are:

1.  The plugin name in `index.ts`
2.  The name of the Plugin class in `index.ts`
3.  The name key/name for the plugin in the `Plugins` interface in `global-types.ts`

After setting up the basic layout of your plugin, I recommend starting by defining the types for your plugin first (in `global-types.ts`) and setting up a test schema that uses your plugin. This allows you to get the user facing API for your plugin working first, so you can see that any new options you add to the API are working as expected, and that any type constraints are enforced correctly. Once you are happy with your API, you can start building out the functionality in index.ts. Building the types first also make the implementation easier because the properties you will need to access in your extension may not exist on the config objects until you have defined your types.

### [`global-types.ts`](https://pothos-graphql.dev/docs/guide/writing-plugins#global-typests)

`global-types.ts` must contain the following:

1.  A declaration of the `PothosSchemaTypes` namespace

2.  An addition to the `Plugins` interface that maps the plugin name, to the plugin type (this needs to be inside the `PothosSchemaTypes` namespace)

`global-types.ts` should NOT include definitions that do not belong to the `PothosSchemaTypes` namespace. Types for your plugin should be added to a separate `types.ts` file, and imported as needed into `global-types.ts`.

To add properties to the various config objects used by the `SchemaBuilder`, you should start by finding the interface that defines that config object in `@pothos/core`. Currently there are 4 main file that define the types that make up `PothosSchemaTypes` namespace.

1.  [`type-options.ts`](https://github.com/hayes/pothos/blob/main/packages/core/src/types/global/type-options.ts):

Contains the interfaces that define the options objects for the various types (Object, Interface, Enum, etc).

2.  [`field-options.ts`](https://github.com/hayes/pothos/blob/main/packages/core/src/types/global/field-options.ts):

Contains the interfaces that define the options objects for creating fields

3.  [`schema-types.ts`](https://github.com/hayes/pothos/blob/main/packages/core/src/types/global/schema-types.ts):

Contains the interfaces for SchemaBuilder options, SchemaTypes, options for `toSchema`, and other utility interfaces that may be useful for plugins to extend that do not fall into one of the other categories.

4.  [`classes.ts`](https://github.com/hayes/pothos/blob/main/packages/core/src/types/global/classes.ts):

Contains interfaces that describe the classes used by Pothos, include `SchemaBuilder` and the various field builder classes.

Once you have identified a type you wish to extend, copy it into the `PothosSchemaTypes` namespace in your `global-types.ts`, but remove all the existing properties. You will need to keep all the Generics used by the interface, and should import the types used in generics from `@pothos/core`. You can now add any new properties to the interface that your plugin needs. Making new properties optional (`newProp?: TypeOfProp`) is recommended for most use cases.

`index.ts` must contain the following:

1.  A bare import of the global types (`import './global-types';`)

2.  The plugins name, which should be typed as a string literal rather than as a generic string:

`const pluginName = 'example'`

3.  A default export of the plugin name `export default pluginName`

4.  A class that extends BasePlugin: `export class PothosExamplePlugin<Types extends SchemaTypes> extends BasePlugin<Types> {}`

`BasePlugin` and `SchemaTypes` can both be imported from `@pothos/core`

5.  A call to register the plugin: `SchemaBuilder.registerPlugin(pluginName, PothosExamplePlugin);`

`SchemaBuilder` can also be imported from `@pothos/core`

### [Life cycle hooks](https://pothos-graphql.dev/docs/guide/writing-plugins#life-cycle-hooks)

The `SchemaBuilder` will instantiate plugins each time the `toSchema` method is called on the builder. As the schema is built, it will invoke the various life cycle methods on each plugin if they have been defined.

To hook into each lifecycle event, simply define the corresponding function in your plugin class. For the exact function signature, see the `index.ts` of the example plugin.

- `onTypeConfig`: Invoked for each type, with the config object that will be used to construct the underlying GraphQL type.

- `onOutputFieldConfig`: Invoked for each Object, or Interface field, with the config object describing the field.

- `onInputFieldConfig`: Invoked for each InputObject field, or field argument, with the config object describing the field.

- `onEnumValueConfig`: Invoked for each value in an enum

- `beforeBuild`: Invoked before building schemas, last chance to add new types or fields.

- `afterBuild`: Invoked with the fully built Schema.

- `wrapResolve`: Invoked when creating the resolver for each field

- `wrapSubscribe`: Invoked for each field in the `Subscriptions` object.

- `wrapResolveType`: Invoked for each Union and Interface.

Each of the lifecycle methods above (except `beforeBuild`) expect a return value that matches their first argument (either a config object, or the resolve/subscribe/resolveType function). If your plugin does not need to modify these values, it can simple return the value that was passed in. When your plugin does need to change one of the config values, you should return a copy of the config object with your modifications, rather than modifying the config object that was passed in. This can be done by either using `Object.assign`, or spreading the original config into a new object `{...originalConfig, newProp: newValue }`.

Each config object will have the properties expected by the GraphQL for creating the types or fields (although some properties like `resolve` will be added later), but will also include a number of Pothos specific properties. These properties include `graphqlKind` to indicate what kind of GraphQL type the config object is for, `pothosOptions`, which contains all the options passed in to the schema builder when creating the type or field.

If your plugin needs to add additional types or fields to the schema it should do this in the `beforeBuild` hook. Any types added to the schema after this, may not be included correctly. Plugins should also account for the fact that a new instance of the plugin will be created each time the schema is called, so any types or fields added the the schema should only be applied once (per schema), even if multiple instances of the plugin are created. The help with this, there is a `runUnique` helper on the base plugin class, which accepts a key, and a callback, and will only run a callback once per schema for the given key.

Below are a few of the most common use cases for how a plugin might extend the Pothos with very simplified examples. Most plugins will likely need a combination of these strategies, and some uses cases may not be well documented. If you are unsure about how to solve a specific problem, feel free to open a GitHub Issue for more help.

In the examples below, when "extending an interface", the interface should be added to the `PothosSchemaTypes` namespace in `global-types.ts`.

### [Adding options to the SchemaBuilder constructor](https://pothos-graphql.dev/docs/guide/writing-plugins#adding-options-to-the-schemabuilder-constructor)

You may have noticed that plugins are not instantiated by the user, and therefore users can't pass options directly into your plugin when creating it. Instead, the recommended way to configure your plugin is by contributing new properties to the options object passed the the SchemaBuilder constructor. This can be done by extending the `SchemaBuilderOptions` interface.

Extending this interface will allow the user to pass in these new options when creating an instance of `SchemaBuilder`.

You can then access the options through `this.builder.options` in your plugin, with everything correctly typed:

### [Adding options when building a schema (`toSchema`)](https://pothos-graphql.dev/docs/guide/writing-plugins#adding-options-when-building-a-schema-toschema)

In some cases, your plugin may be designed for schemas that be built in different modes. For example the mocks plugin allows the schema to be built repeatedly with different sets of mocks, or the subGraph allows building a schema multiple times to generate separate subgraphs. For these cases, you can extend the options passed to `toSchema` instead:

These options can be accessed through `this.options` in your plugin:

### [Adding options to types](https://pothos-graphql.dev/docs/guide/writing-plugins#adding-options-to-types)

Each GraphQL type has it's own options interface which can be extended. For example, to extend the options for creating an Object type:

These options can then be accessed in your plugin when you receive the config for the type:

In the example above, we need to check `typeConfig.kind` to ensure that the type config is for an object. Without this check, typescript will not know that the config object is for an object, and will not let us access the property. `typeConfig.kind` corresponds to how Pothos splits up Types for its config objects, meaning that it has separate `kind`s for `Query`, `Mutation`, and `Subscription` even though these are all `Objects` in GraphQL terminology. The `typeConfig.graphqlKind` can be used to get the actual GraphQL type instead.

### [Adding options to fields](https://pothos-graphql.dev/docs/guide/writing-plugins#adding-options-to-fields)

Similar to Types, fields also have a number of interfaces that can be extended to add options to various types of fields:

Field interfaces have a few more generics than other interfaces we have looked at. These generics can be used to make the options you add more specific to the field currently being defined. It is important to copy all the generics of the interfaces as they are defined in `@pothos/core` even if you do not use the generics in your own properties. If the generics do not match, typescript won't be able to merge the definitions. You do NOT need to include the `extends` clause of the interface, if the interface extends another interface (like `FieldOptions`).

Similar to Type options, Field options will be available in the fieldConfigs in your plugin, once you check that the fieldConfig is for the correct `kind` of field.

### [Adding new methods on builder classes](https://pothos-graphql.dev/docs/guide/writing-plugins#adding-new-methods-on-builder-classes)

Adding new method to `SchemaBuilder` or one of the `FieldBuilder` classes is also done through extending interfaces. Extending these interfaces is how typescript is able to know these methods exist, even though they are not defined on the original classes.

The above is a simple example of defining a new `buildCustomObject` method that takes no arguments, and returns a reference to a new custom object type. Defining this type will not work on it's own, and we still need to define the actual implementation of this method. This might look like:

Note that the above function does NOT use an arrow function, so that the function can access `this` as a reference the the SchemaBuilder instance.

### [Wrapping resolvers to add runtime functionality](https://pothos-graphql.dev/docs/guide/writing-plugins#wrapping-resolvers-to-add-runtime-functionality)

Some plugins will need to add runtime behavior. There are a few lifecycle hooks for wrapping `resolve`, `subscribe`, and `resolveType`. These hooks will receive the function they are wrapping, along with a config object for the field or type they are associated with, and should return either the original function, or a wrapper function with the same API.

It is important to remember that resolvers can resolve values in a number of ways (normal values, promises, or even something as complicated `Promise<(Promise<T> | T)[]>`. So be careful when using a wrapper that introspected the return value of a resolve function. Plugins should only wrap resolvers when absolutely necessary.

### [Transforming a schema](https://pothos-graphql.dev/docs/guide/writing-plugins#transforming-a-schema)

For some plugins the other provided lifecycle may not be sufficiently powerful to modify the schema in all the ways a plugin may want. For example removing types from the schema (eg. the `SubGraph` plugin). In these cases, the `afterBuild` hook can be used. It receives the built schema, and is expected to return either the schema it was passed, or a completely new schema. This allows plugins to use 3rd party libraries like `graphql-tools` to arbitrarily transform schemas if desired.

### [Using SchemaTypes](https://pothos-graphql.dev/docs/guide/writing-plugins#using-schematypes)

You may have noticed that almost every interface and type in `@pothos/core` take a generic that looks like: `Types extends SchemaTypes`. This type is what allows Pothos and its plugins to share type information across the entire schema, and to incorporate user defined types into that system. These SchemaTypes are a combination of default types merged with the Types provided in the Generic parameter of the SchemaBuilder constructor, and includes a wide variety of useful types:

- Types for all the scalars
- Types for backing models used by objects and interfaces when referenced via strings
- The type used for the context and root objects
- Settings for default nullability of fields
- Any user defined types specific to plugins (more info below)

There are many ways these types can be used, but one of the most common is to access the type for the context object, so that you can correctly type a callback function for your plugin that accepts the context object.

### [Using user defined types](https://pothos-graphql.dev/docs/guide/writing-plugins#using-user-defined-types)

As mentioned above, your plugin can also contribute its own user definable types to the SchemaTypes interface. You can see examples of this in the several of the plugins including the directives and `scope-auth` plugins. Adding your own types to SchemaTypes requires extending 2 interfaces: The `UserSchemaTypes` which describes the user provided type will need to extend, and the `ExtendDefaultTypes` interface, which is used to set default values if the User does not provide their own types.

The User provided type can then be accessed using `Types['NewExampleTypes']` in any interface or type that receive `SchemaTypes` as a generic argument.

### [Request data](https://pothos-graphql.dev/docs/guide/writing-plugins#request-data)

Plugins that wrap resolvers may need to store some data that us unique the current request. In these cases your plugin can define a `createRequestData` method, and use the `requestData` method to get the data for the current request.

The shape of requestData can be defined via the second generic parameter of the `BasePlugin` class. The `requestData` method expects the context object as its only argument, which is used to uniquely identify the current request.

### [Wrapping arguments and inputs](https://pothos-graphql.dev/docs/guide/writing-plugins#wrapping-arguments-and-inputs)

The plugin API does not directly have a method for wrapping input fields, instead, the `wrapResolve` and `wrapSubscribe` methods can be used to modify the `args` object before passing it down to the original resolver.

Figuring out how to wrap inputs can be a little complex, especially when dealing with recursive inputs, and optimizing to wrap as little as possible. To help with this, Pothos has a couple of utility functions that can make this easier:

- `mapInputFields`: Used to select affected input fields and extract some configuration
- `createInputValueMapper`: Creates a mapping function that uses the result of `mapInputFields` to map inputs in an args object to new values.

The relay plugin uses these methods to decode `globalID` inputs:

Using these utilities allows moving more logic to build time (figuring out which fields need mapping) so that the runtime overhead is as small as possible.

`createInputValueMapper` may be useful for some use cases, for some plugins it may be better to create a custom mapping function, but still use the result of `mapInputFields`.

`mapInputFields` returns a map who's keys are field/argument names, and who's values are objects with the following shape:

if the `kind` is `InputObject` then the mapping object will also have a fields property with an object of the following shape:

Both the root level map, and the `fields.map` maps will only contain entries for fields where the mapping function did not return null. If the mapping function returned null for all fields, the `mapInputFields` will return null instead of returning a map to indicate no wrapping should occur

### [Removing fields and enum values](https://pothos-graphql.dev/docs/guide/writing-plugins#removing-fields-and-enum-values)

Plugins can remove fields from objects, interfaces, and input objects, and remove specific values from enums. To do this, simply return null from the corresponding on\*Config plugin hook:

Removing whole types from the schema needs to be done by transforming the schema during the `afterBuild` hook. See the `sub-graph` plugin for a more complete example of removing types.

- `builder.configStore.onTypeConfig`: Takes a type ref and a callback, and will invoke the callback with the config for the referenced type once available.

- `fieldRef.onFirstUse` Takes a callback to invoke once the config for the field is available.

- `buildCache.getTypeConfig` Gets the config for a given type after it has been passed through any modifications applied by plugins.

---

## URL: https://pothos-graphql.dev/docs/guide/deno#running-the-app

Title: Using Deno

URL Source: https://pothos-graphql.dev/docs/guide/deno

Markdown Content:
Pothos is compatible with [Deno](https://deno.land/), and can be used with [GraphQL Yoga](https://the-guild.dev/graphql/yoga-server) which now also supports deno!

## [Imports](https://pothos-graphql.dev/docs/guide/deno#imports)

There are a number of different ways to import Pothos, but the best option is ussually to set up [import maps](https://deno.land/manual@v1.28.3/basics/modules/import_maps) and import from [esm.sh](https://esm.sh/).

### [Import maps](https://pothos-graphql.dev/docs/guide/deno#import-maps)

```
// import_maps.json
{
  "imports": {
    // define a version of graphql, this should be shared by all graphql libraries
    "graphql": "https://esm.sh/graphql@16.6.0",
    // Marking graphql as external will all the graphql from this import_map to be used
    "graphql-yoga": "https://esm.sh/graphql-yoga?external=graphql",
    // the `*` prefix in the package name marks all depenencies (only graphql in this case) as external
    // this ensures the version of graphql defined above is used
    "@pothos/core": "https://esm.sh/*@pothos/core@3.23.1",
    // Plugins should mark all dependencies as external as well
    // this will ensure that both graphql and @pothos/core use the versions defined above
    // some plugins like validation may require additional dependencies to be added to the import map (eg. zod)
    "@pothos/plugin-relay": "https://esm.sh/*@pothos/plugin-relay@3.30.0"
  }
}
```

### [deno.json](https://pothos-graphql.dev/docs/guide/deno#denojson)

```
// deno.jsonc
{
  "importMap": "import_map.json"
}
```

## [Server](https://pothos-graphql.dev/docs/guide/deno#server)

```
// src/index.ts
import { serve } from 'https://deno.land/std@0.157.0/http/server.ts';
import { createYoga } from 'graphql-yoga';
import SchemaBuilder from '@pothos/core';

const builder = new SchemaBuilder({});

builder.queryType({
  fields: (t) => ({
    hello: t.string({
      args: {
        name: t.arg.string({}),
      },
      resolve: (_, { name }) => `hello, ${name || 'World'}`,
    }),
  }),
});

const yoga = createYoga({
  schema: builder.toSchema(),
});

serve(yoga, {
  onListen({ hostname, port }) {
    console.log(`Listening on http://${hostname}:${port}/graphql`);
  },
});
```

## [Running the app:](https://pothos-graphql.dev/docs/guide/deno#running-the-app)

`deno run --allow-net src/index.ts`

## [Without import maps](https://pothos-graphql.dev/docs/guide/deno#without-import-maps)

In some cases (like when using the deno deploy playground) you may not be able to use import maps. In this case, you can use query parameters with esm.sh to ensure that shared versions of packages are used:

```
import { serve } from 'https://deno.land/std@0.157.0/http/server.ts';
// for graphql-yoga and pothos/core 'graphql' is the most import depencency to pin
import { createYoga } from 'https://esm.sh/graphql-yoga@3.1.1?deps=graphql@16.6.0';
import SchemaBuilder from 'https://esm.sh/@pothos/core@3.23.1?deps=graphql@16.6.0';
// for pothos plugins, you should pin both 'graphql' and '@pothos/core'
import RelayPlugin from 'https://esm.sh/@pothos/plugin-relay@3.30.0?deps=graphql@16.6.0,@pothos/core@3.23.1';
```

## [The @pothos/deno package](https://pothos-graphql.dev/docs/guide/deno#the-pothosdeno-package)

The `@pothos/deno` package contains a typescript-only version of most of the pothos plugins. This is no longer the recommended way to use pothos with deno, but will continue to be published with new changes.

The files for this package are published to npm, and can be consumed from a number of CDNs. The benefit of this is that all plugins are bundled with pothos/core, and import directly so you do not need to mess with dependencies to ensure that plugins are using the correct version of pothos/core.

### [example](https://pothos-graphql.dev/docs/guide/deno#example)

```
// dependencies of @pothos/deno are imported from https://cdn.skypack.dev/{package} to ensure
// that the same version of 'graphql' is used, import other dependencies from sky pack as well
import { serve } from 'https://deno.land/std@0.157.0/http/server.ts';
import { createYoga } from 'https://cdn.skypack.dev/graphql-yoga@3.1.1';
import SchemaBuilder from 'https://esm.sh/@pothos/deno/packages/core/mod.ts';
import RelayPlugin from 'https://esm.sh/@pothos/deno/packages/plugin-relay/mod.ts';
```

Pothos uses `https://cdn.skypack.dev/graphql?dts` which can be added to an import map to import a different version of graphql.

---

## URL: https://pothos-graphql.dev/docs/plugins/federation#setup

Title: Federation plugin

URL Source: https://pothos-graphql.dev/docs/plugins/federation

Markdown Content:
A plugin for building subGraphs that are compatible with [Apollo Federation 2](https://www.apollographql.com/docs/federation/).

This page will describe the basics of the Pothos API for federation, but will not cover detailed information on how federation works, or what all the terms on this page mean. For more general information on federation, see the [official docs](https://www.apollographql.com/docs/federation/v2/)

### [Install](https://pothos-graphql.dev/docs/plugins/federation#install)

You will need to install the plugin, as well as the directives plugin (`@pothos/plugin-directives`) and `@apollo/subgraph`

You will likely want to install @apollo/server as well, but it is not required if you want to use a different server

### [Setup](https://pothos-graphql.dev/docs/plugins/federation#setup)

### [Defining entities](https://pothos-graphql.dev/docs/plugins/federation#defining-entities)

Defining entities for you schema is a 2 step process. First you will need to define an object type as you would normally, then you can convert that object type to an entity by providing a `key` (or `keys`), and a method to load that entity.

`keys` are defined using `builder.selection`. This method _MUST_ be called with a generic argument that defines the types for any fields that are part of the key. `key` may also be an array. `resolveReference` will be called with the type used by the `key` selection.

Entities are Object types that may be extended with or returned by fields in other services. `builder.asEntity` describes how the Entity will be loaded when used by another services. The `key` select (or selection) should use the types of scalars your server will produce for inputs. For example, Apollo server will convert all ID fields to `string`s, even if resolvers in other services returns IDs as numbers.

### [Extending external entities](https://pothos-graphql.dev/docs/plugins/federation#extending-external-entities)

External entities can be extended by calling `builder.externalRef`, and then calling implement on the returned ref.

`builder.externalRef` takes the name of the entity, a selection (using `builder.selection`, just like a `key` on an entity object), and a resolve method that loads an object given a `key`. The return type of the resolver is used as the backing type for the ref, and will be the type of the `parent` arg when defining fields for this type. The `key` also describes what fields will be selected from another service to use as the `parent` object in resolvers for fields added when implementing the `externalRef`.

To set the `resolvable` property of an external field to `false`, can use `builder.keyDirective`:

### [Adding a provides directive](https://pothos-graphql.dev/docs/plugins/federation#adding-a-provides-directive)

To add a `@provides` directive, you will need to implement the Parent type of the field being provided as an external ref, and then use the `.provides` method of the returned ref when defining the field that will have the `@provides` directive. The provided field must be listed as an `externalField` in the external type.

### [Building your schema and starting a server](https://pothos-graphql.dev/docs/plugins/federation#building-your-schema-and-starting-a-server)

For a functional example that combines multiple graphs built with Pothos into a single schema see [https://github.com/hayes/pothos/tree/main/packages/plugin-federation/tests/example](https://github.com/hayes/pothos/tree/main/packages/plugin-federation/tests/example)

### [Printing the schema](https://pothos-graphql.dev/docs/plugins/federation#printing-the-schema)

If you are printing the schema as a string for any reason, and then using the printed schema for Apollo Federation(submitting if using Managed Federation, or composing manually with `rover`), you must use `printSubgraphSchema`(from `@apollo/subgraph`) or another compatible way of printing the schema(that includes directives) in order for it to work.

### [Field directives directives](https://pothos-graphql.dev/docs/plugins/federation#field-directives-directives)

Several federation directives can be configured directly when defining a field includes `@shareable`, `@tag`, `@inaccessible`, and `@override`.

For more details on these directives, see the official Federation documentation.

### [interface entities and @interfaceObject](https://pothos-graphql.dev/docs/plugins/federation#interface-entities-and-interfaceobject)

Federation 2.3 introduces new features for federating interface definitions.

You can now pass interfaces to `asEntity` to defined keys for an interface:

You can also extend interfaces from another subGraph by creating an `interfaceObject`:

See federation documentation for more details on `interfaceObject`s

### [composeDirective =](https://pothos-graphql.dev/docs/plugins/federation#composedirective-)

You can apply the `composeDirective` directive when building the subgraph schema:

---

## URL: https://pothos-graphql.dev/docs/plugins/federation#interface-entities-and-interfaceobject

Title: Federation plugin

URL Source: https://pothos-graphql.dev/docs/plugins/federation

Markdown Content:
A plugin for building subGraphs that are compatible with [Apollo Federation 2](https://www.apollographql.com/docs/federation/).

This page will describe the basics of the Pothos API for federation, but will not cover detailed information on how federation works, or what all the terms on this page mean. For more general information on federation, see the [official docs](https://www.apollographql.com/docs/federation/v2/)

### [Install](https://pothos-graphql.dev/docs/plugins/federation#install)

You will need to install the plugin, as well as the directives plugin (`@pothos/plugin-directives`) and `@apollo/subgraph`

You will likely want to install @apollo/server as well, but it is not required if you want to use a different server

### [Setup](https://pothos-graphql.dev/docs/plugins/federation#setup)

### [Defining entities](https://pothos-graphql.dev/docs/plugins/federation#defining-entities)

Defining entities for you schema is a 2 step process. First you will need to define an object type as you would normally, then you can convert that object type to an entity by providing a `key` (or `keys`), and a method to load that entity.

`keys` are defined using `builder.selection`. This method _MUST_ be called with a generic argument that defines the types for any fields that are part of the key. `key` may also be an array. `resolveReference` will be called with the type used by the `key` selection.

Entities are Object types that may be extended with or returned by fields in other services. `builder.asEntity` describes how the Entity will be loaded when used by another services. The `key` select (or selection) should use the types of scalars your server will produce for inputs. For example, Apollo server will convert all ID fields to `string`s, even if resolvers in other services returns IDs as numbers.

### [Extending external entities](https://pothos-graphql.dev/docs/plugins/federation#extending-external-entities)

External entities can be extended by calling `builder.externalRef`, and then calling implement on the returned ref.

`builder.externalRef` takes the name of the entity, a selection (using `builder.selection`, just like a `key` on an entity object), and a resolve method that loads an object given a `key`. The return type of the resolver is used as the backing type for the ref, and will be the type of the `parent` arg when defining fields for this type. The `key` also describes what fields will be selected from another service to use as the `parent` object in resolvers for fields added when implementing the `externalRef`.

To set the `resolvable` property of an external field to `false`, can use `builder.keyDirective`:

### [Adding a provides directive](https://pothos-graphql.dev/docs/plugins/federation#adding-a-provides-directive)

To add a `@provides` directive, you will need to implement the Parent type of the field being provided as an external ref, and then use the `.provides` method of the returned ref when defining the field that will have the `@provides` directive. The provided field must be listed as an `externalField` in the external type.

### [Building your schema and starting a server](https://pothos-graphql.dev/docs/plugins/federation#building-your-schema-and-starting-a-server)

For a functional example that combines multiple graphs built with Pothos into a single schema see [https://github.com/hayes/pothos/tree/main/packages/plugin-federation/tests/example](https://github.com/hayes/pothos/tree/main/packages/plugin-federation/tests/example)

### [Printing the schema](https://pothos-graphql.dev/docs/plugins/federation#printing-the-schema)

If you are printing the schema as a string for any reason, and then using the printed schema for Apollo Federation(submitting if using Managed Federation, or composing manually with `rover`), you must use `printSubgraphSchema`(from `@apollo/subgraph`) or another compatible way of printing the schema(that includes directives) in order for it to work.

### [Field directives directives](https://pothos-graphql.dev/docs/plugins/federation#field-directives-directives)

Several federation directives can be configured directly when defining a field includes `@shareable`, `@tag`, `@inaccessible`, and `@override`.

For more details on these directives, see the official Federation documentation.

### [interface entities and @interfaceObject](https://pothos-graphql.dev/docs/plugins/federation#interface-entities-and-interfaceobject)

Federation 2.3 introduces new features for federating interface definitions.

You can now pass interfaces to `asEntity` to defined keys for an interface:

You can also extend interfaces from another subGraph by creating an `interfaceObject`:

See federation documentation for more details on `interfaceObject`s

### [composeDirective =](https://pothos-graphql.dev/docs/plugins/federation#composedirective-)

You can apply the `composeDirective` directive when building the subgraph schema:

---

## URL: https://pothos-graphql.dev/docs/migrations/giraphql-pothos#prisma-plugin

Title: Giraphql to Pothos

URL Source: https://pothos-graphql.dev/docs/migrations/giraphql-pothos

Markdown Content:
[Migrating from GiraphQL to Pothos](https://pothos-graphql.dev/docs/migrations/giraphql-pothos#migrating-from-giraphql-to-pothos)

---

As of 3.0 GiraphQL has been renamed to Pothos. The primary motivation for this rename is to make this library and associated projects, guides, and other content to be more discoverable. GiraphQL is not visually distinct from GraphQL, and has often been interpreted as a typo. Search engines tend to auto-correct the name to GraphQL, making it hard to search for.

## [Changes for consumers of GiraphQL](https://pothos-graphql.dev/docs/migrations/giraphql-pothos#changes-for-consumers-of-giraphql)

- All packages have been moved from the `@giraphql/*` scope to `@pothos/*` scope.
- The `GiraphQLSchemaTypes` global typescript scope has been renamed to `PothosSchemaTypes`
- Exported types prefixed with `GiraphQL` have had that prefix replaced with `Pothos`

For the most part, the easiest way to upgrade is by doing a CASE SENSITIVE search and replace of `giraphql` ->`pothos` and `GiraphQL` ->`Pothos`. The only non-documentation change between the latest version of GiraphQL and the initial version of Pothos (`v3.0.0`) are renaming of types and packages.

## [Plugin specific changes](https://pothos-graphql.dev/docs/migrations/giraphql-pothos#plugin-specific-changes)

### [Prisma plugin](https://pothos-graphql.dev/docs/migrations/giraphql-pothos#prisma-plugin)

- The generator/provider for prisma types has been renamed to `prisma-pothos-types`.

You will need to update your prisma schema to use the new provider:

```
generator pothos {
  provider = "prisma-pothos-types"
}
```

## [For plugin authors](https://pothos-graphql.dev/docs/migrations/giraphql-pothos#for-plugin-authors)

- Some `extensions` fields in the build schemas have been renamed. Specifically:

- `giraphQLOptions` has been renamed to `pothosOptions`

- `giraphQLConfig` has been renamed to `pothosConfig`

---

## URL: https://pothos-graphql.dev/docs/migrations/v2#args-on-exposed-fields

Title: v2.0

URL Source: https://pothos-graphql.dev/docs/migrations/v2

Markdown Content:
The 2.0 release was mostly focused around re-designing the plugin system so it could be properly documented, and made available for broader adoption. The previous plugin system allowed plugins to use the FieldWrapper base class to wrap fields. Unfortunately the overhead of this wrapping strategy was significantly higher than expected, and could not be optimized in a way that justified the conveniences it provided.

### [Auth plugin](https://pothos-graphql.dev/docs/migrations/v2#auth-plugin)

The auth plugin has been replaced by a new `scope-auth` plugin. Unfortunately due to the performance problems with the original field wrapping API, the auth plugin had to be re-designed, and maintaining the existing API at the cost of significant performance overhead did not seem justified.

Any existing usage of the `auth` plugin will need to be replaced with the new `scope-auth` plugin. The API of the new `scope-auth` plugin is substantially different, and the specifics of the migration will depend on the exact usage of the original auth plugin. Documentation on the new plugin can be found [here](https://pothos-graphql.dev/docs/plugins/scope-auth).

### [Plugin names](https://pothos-graphql.dev/docs/migrations/v2#plugin-names)

Plugin names have been normalized, and are now exported as the default export of the plugin packages.

Change:

### [Plugin Order](https://pothos-graphql.dev/docs/migrations/v2#plugin-order)

The old plugin API did not make strong guarantees about the order in which plugin hooks would be executed. Plugins are now always triggered in reverse order. The most critical plugins (like `auth-scope`) should appear first in the list of plugins. This ensures that any modifications made by other plugins are applied first, and lets the more important plugins be at the top of the call stack when resolving fields.

### [InputFieldBuilder.bool and InputFieldBuilder.boolList](https://pothos-graphql.dev/docs/migrations/v2#inputfieldbuilderbool-and-inputfieldbuilderboollist)

The `bool` alias on `InputFieldBuilder` has been removed, as it was inconsistent with the other field builders and general naming convention of other methods. Usage of this method should be converted to the canonical `boolean` and `booleanList` methods.

Change:

### [args on "exposed" fields](https://pothos-graphql.dev/docs/migrations/v2#args-on-exposed-fields)

Fields defined with the `expose` helpers no longer accept `args` since they also do not have a resolver.

### [Plugin API](https://pothos-graphql.dev/docs/migrations/v2#plugin-api)

The Plugin API has been completely re-designed and is now [documented here](https://pothos-graphql.dev/docs/guide/writing-plugins). new instances of plugins are now instantiated each time `toSchema` is called on the `SchemaBuilder`, rather than being tied to the lifetime of the `SchemaBuilder` itself.

- Lots of new documentation
- New scope-auth plugin
- New directives plugin
- New plugin API
- Significant performance improvements in smart-subscriptions and scope-auth plugins

---

## URL: https://pothos-graphql.dev/docs/plugins/prisma/objects#adding-prisma-fields-to-non-prisma-objects-including-query-and-mutation

Title: Prisma Objects

URL Source: https://pothos-graphql.dev/docs/plugins/prisma/objects

Markdown Content:
Prisma Objects

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 1: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Add GraphQL plugin](https://pothos-graphql.dev/docs/plugins/add-graphql)[Complexity plugin](https://pothos-graphql.dev/docs/plugins/complexity)[Dataloader plugin](https://pothos-graphql.dev/docs/plugins/dataloader)[Directive plugin](https://pothos-graphql.dev/docs/plugins/directives)[Drizzle plugin](https://pothos-graphql.dev/docs/plugins/drizzle)[Errors plugin](https://pothos-graphql.dev/docs/plugins/errors)[Federation plugin](https://pothos-graphql.dev/docs/plugins/federation)[Mocks plugin](https://pothos-graphql.dev/docs/plugins/mocks)[Relay plugin](https://pothos-graphql.dev/docs/plugins/relay)[Auth plugin](https://pothos-graphql.dev/docs/plugins/scope-auth)[Simple objects plugin](https://pothos-graphql.dev/docs/plugins/simple-objects)[Smart subscriptions plugin](https://pothos-graphql.dev/docs/plugins/smart-subscriptions)[SubGraph plugin](https://pothos-graphql.dev/docs/plugins/sub-graph)[Tracing plugin](https://pothos-graphql.dev/docs/plugins/tracing)[With-Input plugin](https://pothos-graphql.dev/docs/plugins/with-input)[Zod Validation plugin](https://pothos-graphql.dev/docs/plugins/zod)

[Prisma](https://pothos-graphql.dev/docs/plugins/prisma)

[Setup](https://pothos-graphql.dev/docs/plugins/prisma/setup)[Prisma Objects](https://pothos-graphql.dev/docs/plugins/prisma/objects)[Relations](https://pothos-graphql.dev/docs/plugins/prisma/relations)[Selections](https://pothos-graphql.dev/docs/plugins/prisma/selections)[Relay](https://pothos-graphql.dev/docs/plugins/prisma/relay)[Connections](https://pothos-graphql.dev/docs/plugins/prisma/connections)[Type variants](https://pothos-graphql.dev/docs/plugins/prisma/variants)[Indirect relations](https://pothos-graphql.dev/docs/plugins/prisma/indirect-relations)[Interfaces](https://pothos-graphql.dev/docs/plugins/prisma/interfaces)[Prisma Utils](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils)[Prisma without a plugin](https://pothos-graphql.dev/docs/plugins/prisma/without-a-plugin)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

Prisma Objects Creating types with `builder.prismaObject`

[Plugins](https://pothos-graphql.dev/docs/plugins)/[Prisma](https://pothos-graphql.dev/docs/plugins/prisma)

# Prisma Objects

## [Creating types with `builder.prismaObject`](https://pothos-graphql.dev/docs/plugins/prisma/objects#creating-types-with-builderprismaobject)

`builder.prismaObject` takes 2 arguments:

1.  `name`: The name of the prisma model this new type represents
2.  `options`: options for the type being created, this is very similar to the options for any other object type

```
builder.prismaObject('User', {
  // Optional name for the object, defaults to the name of the prisma model
  name: 'PostAuthor',
  fields: (t) => ({
    id: t.exposeID('id'),
    email: t.exposeString('email'),
  }),
});

builder.prismaObject('Post', {
  fields: (t) => ({
    id: t.exposeID('id'),
    title: t.exposeString('title'),
  }),
});
```

So far, this is just creating some simple object types. They work just like any other object type in Pothos. The main advantage of this is that we get the type information without using object refs, or needing imports from prisma client.

## [Adding prisma fields to non-prisma objects (including Query and Mutation)](https://pothos-graphql.dev/docs/plugins/prisma/objects#adding-prisma-fields-to-non-prisma-objects-including-query-and-mutation)

There is a new `t.prismaField` method which can be used to define fields that resolve to your prisma types:

```
builder.queryType({
  fields: (t) => ({
    me: t.prismaField({
      type: 'User',
      resolve: async (query, root, args, ctx, info) =>
        prisma.user.findUniqueOrThrow({
          ...query,
          where: { id: ctx.userId },
        }),
    }),
  }),
});
```

This method works just like the normal `t.field` method with a couple of differences:

1.  The `type` option must contain the name of the prisma model (eg. `User` or `[User]` for a list field).
2.  The `resolve` function has a new first argument `query` which should be spread into query prisma query. This will be used to load data for nested relationships.

You do not need to use this method, and the `builder.prismaObject` method returns an object ref than can be used like any other object ref (with `t.field`), but using `t.prismaField` will allow you to take advantage of more efficient queries.

The `query` object will contain an object with `include` or `select` options to pre-load data needed to resolve nested parts of the current query. The included/selected fields are based on which fields are being queried, and the options provided when defining those fields and types.

## [Extending prisma objects](https://pothos-graphql.dev/docs/plugins/prisma/objects#extending-prisma-objects)

The normal `builder.objectField(s)` methods can be used to extend prisma objects, but do not support using selections, or exposing fields not in the default selection. To use these features, you can use

`builder.prismaObjectField` or `builder.prismaObjectFields` instead.

[Setup Setting up the Prisma plugin](https://pothos-graphql.dev/docs/plugins/prisma/setup)[Relations Adding relations to prism objects](https://pothos-graphql.dev/docs/plugins/prisma/relations)

### On this page

[Creating types with `builder.prismaObject`](https://pothos-graphql.dev/docs/plugins/prisma/objects#creating-types-with-builderprismaobject)[Adding prisma fields to non-prisma objects (including Query and Mutation)](https://pothos-graphql.dev/docs/plugins/prisma/objects#adding-prisma-fields-to-non-prisma-objects-including-query-and-mutation)[Extending prisma objects](https://pothos-graphql.dev/docs/plugins/prisma/objects#extending-prisma-objects)

---

## URL: https://pothos-graphql.dev/docs/plugins/prisma/relations#relationcount

Title: Relations

URL Source: https://pothos-graphql.dev/docs/plugins/prisma/relations

Markdown Content:
You can add fields for relations using the `t.relation` method:

`t.relation` defines a field that can be pre-loaded by a parent resolver. This will create something like `{ include: { author: true }}` that will be passed as part of the `query` argument of a `prismaField` resolver. If the parent is another `relation` field, the includes will become nested, and the full relation chain will be passed to the `prismaField` that started the chain.

For example the query:

the ` me``prismaField ` would receive something like the following as its query parameter:

This will work perfectly for the majority of queries. There are a number of edge cases that make it impossible to resolve everything in a single query. When this happens Pothos will automatically construct an additional query to ensure that everything is still loaded correctly, and split into as few efficient queries as possible. This process is described in more detail below

### [Fallback queries](https://pothos-graphql.dev/docs/plugins/prisma/relations#fallback-queries)

There are some cases where data can not be pre-loaded by a prisma field. In these cases, pothos will issue a `findUnique` query for the parent of any fields that were not pre-loaded, and select the missing relations so those fields can be resolved with the correct data. These queries should be very efficient, are batched by pothos to combine requirements for multiple fields into one query, and batched by Prisma to combine multiple queries (in an n+1 situation) to a single sql query.

The following are some edge cases that could cause an additional query to be necessary:

- The parent object was not loaded through a field defined with `t.prismaField`, or `t.relation`
- The root `prismaField` did not correctly spread the `query` arguments in is prisma call.
- The query selects multiple fields that use the same relation with different filters, sorting, or limits
- The query contains multiple aliases for the same relation field with different arguments in a way that results in different query options for the relation.
- A relation field has a query that is incompatible with the default includes of the parent object

All of the above should be relatively uncommon in normal usage, but the plugin ensures that these types of edge cases are automatically handled when they do occur.

### [Filters, Sorting, and arguments](https://pothos-graphql.dev/docs/plugins/prisma/relations#filters-sorting-and-arguments)

So far we have been describing very simple queries without any arguments, filtering, or sorting. For `t.prismaField` definitions, you can add arguments to your field like normal, and pass them into your prisma query as needed. For `t.relation` the flow is slightly different because we are not making a prisma query directly. We do this by adding a `query` option to our field options. Query can either be a query object, or a method that returns a query object based on the field arguments.

The returned query object will be added to the include section of the `query` argument that gets passed into the first argument of the parent `t.prismaField`, and can include things like `where`, `skip`, `take`, and `orderBy`. The `query` function will be passed the arguments for the field, and the context for the current request. Because it is used for pre-loading data, and solving n+1 issues, it can not be passed the `parent` object because it may not be loaded yet.

### [relationCount](https://pothos-graphql.dev/docs/plugins/prisma/relations#relationcount)

Prisma supports querying for [relation counts](https://www.prisma.io/docs/concepts/components/prisma-client/aggregation-grouping-summarizing#count-relations) which allow including counts for relations along side other `includes`. Before prisma 4.2.0, this does not support any filters on the counts, but can give a total count for a relation. Starting from prisma 4.2.0, filters on relation count are available under the `filteredRelationCount` preview feature flag.

---

## URL: https://pothos-graphql.dev/docs/plugins/prisma/selections#using-arguments-or-context-in-your-selections

Title: Selections

URL Source: https://pothos-graphql.dev/docs/plugins/prisma/selections

Markdown Content:
Selections

===============

Pothos v4 is now available! 🎉[Check out the full migration guide here](https://pothos-graphql.dev/docs/migrations/v4)

[![Image 1: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

[![Image 2: Pothos](https://pothos-graphql.dev/assets/logo-name-auto.svg)](https://pothos-graphql.dev/)

Search

⌘K

[Discord](https://discord.gg/mNe73qvwAB)[Examples](https://github.com/hayes/pothos/tree/main/examples)

[Overview](https://pothos-graphql.dev/docs)[Sponsors](https://pothos-graphql.dev/docs/sponsors)[Resources](https://pothos-graphql.dev/docs/resources)

[Guide](https://pothos-graphql.dev/docs/guide)

[Plugins](https://pothos-graphql.dev/docs/plugins)

[Add GraphQL plugin](https://pothos-graphql.dev/docs/plugins/add-graphql)[Complexity plugin](https://pothos-graphql.dev/docs/plugins/complexity)[Dataloader plugin](https://pothos-graphql.dev/docs/plugins/dataloader)[Directive plugin](https://pothos-graphql.dev/docs/plugins/directives)[Drizzle plugin](https://pothos-graphql.dev/docs/plugins/drizzle)[Errors plugin](https://pothos-graphql.dev/docs/plugins/errors)[Federation plugin](https://pothos-graphql.dev/docs/plugins/federation)[Mocks plugin](https://pothos-graphql.dev/docs/plugins/mocks)[Relay plugin](https://pothos-graphql.dev/docs/plugins/relay)[Auth plugin](https://pothos-graphql.dev/docs/plugins/scope-auth)[Simple objects plugin](https://pothos-graphql.dev/docs/plugins/simple-objects)[Smart subscriptions plugin](https://pothos-graphql.dev/docs/plugins/smart-subscriptions)[SubGraph plugin](https://pothos-graphql.dev/docs/plugins/sub-graph)[Tracing plugin](https://pothos-graphql.dev/docs/plugins/tracing)[With-Input plugin](https://pothos-graphql.dev/docs/plugins/with-input)[Zod Validation plugin](https://pothos-graphql.dev/docs/plugins/zod)

[Prisma](https://pothos-graphql.dev/docs/plugins/prisma)

[Setup](https://pothos-graphql.dev/docs/plugins/prisma/setup)[Prisma Objects](https://pothos-graphql.dev/docs/plugins/prisma/objects)[Relations](https://pothos-graphql.dev/docs/plugins/prisma/relations)[Selections](https://pothos-graphql.dev/docs/plugins/prisma/selections)[Relay](https://pothos-graphql.dev/docs/plugins/prisma/relay)[Connections](https://pothos-graphql.dev/docs/plugins/prisma/connections)[Type variants](https://pothos-graphql.dev/docs/plugins/prisma/variants)[Indirect relations](https://pothos-graphql.dev/docs/plugins/prisma/indirect-relations)[Interfaces](https://pothos-graphql.dev/docs/plugins/prisma/interfaces)[Prisma Utils](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils)[Prisma without a plugin](https://pothos-graphql.dev/docs/plugins/prisma/without-a-plugin)

[Migrations](https://pothos-graphql.dev/docs/migrations)

[Design](https://pothos-graphql.dev/docs/design)

Api

[](https://github.com/hayes/pothos)

Selections Includes on types

[Plugins](https://pothos-graphql.dev/docs/plugins)/[Prisma](https://pothos-graphql.dev/docs/plugins/prisma)

# Selections

## [Includes on types](https://pothos-graphql.dev/docs/plugins/prisma/selections#includes-on-types)

In some cases, you may want to always pre-load certain relations. This can be helpful for defining fields directly on type where the underlying data may come from a related table.

```
builder.prismaObject('User', {
  // This will always include the profile when a user object is loaded.  Deeply nested relations can
  // also be included this way.
  include: {
    profile: true,
  },
  fields: (t) => ({
    id: t.exposeID('id'),
    email: t.exposeString('email'),
    bio: t.string({
      // The profile relation will always be loaded, and user will now be typed to include the
      // profile field so you can return the bio from the nested profile relation.
      resolve: (user) => user.profile.bio,
    }),
  }),
});
```

## [Select mode for types](https://pothos-graphql.dev/docs/plugins/prisma/selections#select-mode-for-types)

By default, the prisma plugin will use `include` when including relations, or generating fallback queries. This means we are always loading all columns of a table when loading it in a `t.prismaField` or a `t.relation`. This is usually what we want, but in some cases, you may want to select specific columns instead. This can be useful if you have tables with either a very large number of columns, or specific columns with large payloads you want to avoid loading.

To do this, you can add a `select` instead of an include to your `prismaObject`:

```
builder.prismaObject('User', {
  select: {
    id: true,
  },
  fields: (t) => ({
    id: t.exposeID('id'),
    email: t.exposeString('email'),
  }),
});
```

The `t.expose*` and `t.relation` methods will all automatically add selections for the exposed fields _WHEN THEY ARE QUERIED_, ensuring that only the requested columns will be loaded from the database.

In addition to the `t.expose` and `t.relation`, you can also add custom selections to other fields:

```
builder.prismaObject('User', {
  select: {
    id: true,
  },
  fields: (t) => ({
    id: t.exposeID('id'),
    email: t.exposeString('email'),
    bio: t.string({
      // This will select user.profile.bio when the the `bio` field is queried
      select: {
        profile: {
          select: {
            bio: true,
          },
        },
      },
      resolve: (user) => user.profile.bio,
    }),
  }),
});
```

## [Using arguments or context in your selections](https://pothos-graphql.dev/docs/plugins/prisma/selections#using-arguments-or-context-in-your-selections)

The following is a slightly contrived example, but shows how arguments can be used when creating a selection for a field:

```
const PostDraft = builder.prismaObject('Post', {
  fields: (t) => ({
    title: t.exposeString('title'),
    commentFromDate: t.string({
      args: {
        date: t.arg({ type: 'Date', required: true }),
      },
      select: (args) => ({
        comments: {
          take: 1,
          where: {
            createdAt: {
              gt: args.date,
            },
          },
        },
      }),
      resolve: (post) => post.comments[0]?.content,
    }),
  }),
});
```

## [Optimized queries without `t.prismaField`](https://pothos-graphql.dev/docs/plugins/prisma/selections#optimized-queries-without-tprismafield)

In some cases, it may be useful to get an optimized query for fields where you can't use `t.prismaField`.

This may be required for combining with other plugins, or because your query does not directly return a `PrismaObject`. In these cases, you can use the `queryFromInfo` helper. An example of this might be a mutation that wraps the prisma object in a result type.

```
const Post = builder.prismaObject('Post', {...});

builder.objectRef<{
  success: boolean;
  post?: Post
  }>('CreatePostResult').implement({
  fields: (t) => ({
    success: t.boolean(),
    post: t.field({
      type: Post,
      nullable:
      resolve: (result) => result.post,
    }),
  }),
});

builder.mutationField(
  'createPost',
  {
    args: (t) => ({
      title: t.string({ required: true }),
      ...
    }),
  },
  {
    resolve: async (parent, args, context, info) => {
      if (!validateCreatePostArgs(args)) {
        return {
          success: false,
        }
      }

      const post = prisma.city.create({
        ...queryFromInfo({
          context,
          info,
          // nested path where the selections for this type can be found
          path: ['post']
          // optionally you can pass a custom initial selection, generally you wouldn't need this
          // but if the field at `path` is not selected, the initial selection set may be empty
          select: {
            comments: true,
          },
        }),
        data: {
          title: args.input.title,
          ...
        },
      });

      return {
        success: true,
        post,
      }
    },
  },
);
```

[Relations Adding relations to prism objects](https://pothos-graphql.dev/docs/plugins/prisma/relations)[Relay Using the Prisma and Relay plugins together](https://pothos-graphql.dev/docs/plugins/prisma/relay)

### On this page

[Includes on types](https://pothos-graphql.dev/docs/plugins/prisma/selections#includes-on-types)[Select mode for types](https://pothos-graphql.dev/docs/plugins/prisma/selections#select-mode-for-types)[Using arguments or context in your selections](https://pothos-graphql.dev/docs/plugins/prisma/selections#using-arguments-or-context-in-your-selections)[Optimized queries without `t.prismaField`](https://pothos-graphql.dev/docs/plugins/prisma/selections#optimized-queries-without-tprismafield)

---

## URL: https://pothos-graphql.dev/docs/plugins/prisma/connections#sharing-connections-objects

Title: Connections

URL Source: https://pothos-graphql.dev/docs/plugins/prisma/connections

Markdown Content:

### [`prismaConnection`](https://pothos-graphql.dev/docs/plugins/prisma/connections#prismaconnection)

The `prismaConnection` method on a field builder can be used to create a relay `connection` field that also pre-loads all the data nested inside that connection.

#### [options](https://pothos-graphql.dev/docs/plugins/prisma/connections#options)

- `type`: the name of the prisma model being connected to
- `cursor`: a `@unique` column of the model being connected to. This is used as the `cursor` option passed to prisma.
- `defaultSize`: (default: 20) The default page size to use if `first` and `last` are not provided.
- `maxSize`: (default: 100) The maximum number of nodes returned for a connection.
- `resolve`: Like the resolver for `prismaField`, the first argument is a `query` object that should be spread into your prisma query. The `resolve` function should return an array of nodes for the connection. The `query` will contain the correct `take`, `skip`, and `cursor` options based on the connection arguments (`before`, `after`, `first`, `last`), along with `include` options for nested selections.
- `totalCount`: A function for loading the total count for the connection. This will add a `totalCount` field to the connection object. The `totalCount` method will receive (`connection`, `args`, `context`, `info`) as arguments. Note that this will not work when using a shared connection object (see details below)

The created connection queries currently support the following combinations of connection arguments:

- `first`, `last`, or `before`
- `first` and `before`
- `last` and `after`

Queries for other combinations are not as useful, and generally requiring loading all records between 2 cursors, or between a cursor and the end of the set. Generating query options for these cases is more complex and likely very inefficient, so they will currently throw an Error indicating the argument combinations are not supported.

The `maxSize` and `defaultSize` can also be configured globally using `maxConnectionSize` and `defaultConnectionSize` options in the `prisma` plugin options.

### [`relatedConnection`](https://pothos-graphql.dev/docs/plugins/prisma/connections#relatedconnection)

The `relatedConnection` method can be used to create a relay `connection` field based on a relation of the current model.

#### [options](https://pothos-graphql.dev/docs/plugins/prisma/connections#options-1)

- `cursor`: a `@unique` column of the model being connected to. This is used as the `cursor` option passed to prisma.
- `defaultSize`: (default: 20) The default page size to use if `first` and `last` are not provided.
- `maxSize`: (default: 100) The maximum number of nodes returned for a connection.
- `query`: A method that accepts the `args` and `context` for the connection field, and returns filtering and sorting logic that will be merged into the query for the relation.
- `totalCount`: when set to true, this will add a `totalCount` field to the connection object. see `relationCount` above for more details. Note that this will not work when using a shared connection object (see details below)

### [Indirect relations as connections](https://pothos-graphql.dev/docs/plugins/prisma/connections#indirect-relations-as-connections)

Creating connections from indirect relations is a little more involved, but can be achieved using `prismaConnectionHelpers` with a normal `t.connection` field.

The above example assumes that you are paginating a relation to a join table, where the pagination args are applied based on the relation to that join table, but the nodes themselves are nested deeper.

`prismaConnectionHelpers` can also be used to manually create a connection where the edge and connections share the same model, and pagination happens directly on a relation to nodes type (even if that relation is nested).

To add arguments for a connection defined with a helper, it is often easiest to define the arguments on the connection field rather than the connection helper. This allows connection helpers to be shared between fields that may not share the same arguments:

Arguments, ordering and filtering can also be defined on the helpers themselves:

### [Sharing Connections objects](https://pothos-graphql.dev/docs/plugins/prisma/connections#sharing-connections-objects)

You can create reusable connection objects by using `builder.connectionObject`.

These connection objects can be used with `t.prismaConnection`, `t.relatedConnection`, or `t.connection`

Shared edges can also be created using `t.edgeObject`

### [Extending connection edges](https://pothos-graphql.dev/docs/plugins/prisma/connections#extending-connection-edges)

In some cases you may want to expose some data from an indirect connection on the edge object.

### [Total count on shared connection objects](https://pothos-graphql.dev/docs/plugins/prisma/connections#total-count-on-shared-connection-objects)

If you are set the `totalCount: true` on a `prismaConnection` or `relatedConnection` field, and are using a custom connection object, you will need to manually add the `totalCount` field to the connection object manually. The parent object on the connection will have a `totalCount` property that is either a the totalCount, or a function that will return the totalCount.

If you want to add a global `totalCount` field, you can do something similar using `builder.globalConnectionField`:

### [`parsePrismaCursor` and `formatPrismaCursor`](https://pothos-graphql.dev/docs/plugins/prisma/connections#parseprismacursor-and-formatprismacursor)

These functions can be used to manually parse and format cursors that are compatible with prisma connections.

Parsing a cursor will return the value from the column used for the cursor (often the `id`), this value may be an array or object when a compound index is used as the cursor. Similarly, to format a cursor, you must provide the column(s) that make up the cursor.

---

## URL: https://pothos-graphql.dev/docs/plugins/prisma/connections#extending-connection-edges

Title: Connections

URL Source: https://pothos-graphql.dev/docs/plugins/prisma/connections

Markdown Content:

### [`prismaConnection`](https://pothos-graphql.dev/docs/plugins/prisma/connections#prismaconnection)

The `prismaConnection` method on a field builder can be used to create a relay `connection` field that also pre-loads all the data nested inside that connection.

#### [options](https://pothos-graphql.dev/docs/plugins/prisma/connections#options)

- `type`: the name of the prisma model being connected to
- `cursor`: a `@unique` column of the model being connected to. This is used as the `cursor` option passed to prisma.
- `defaultSize`: (default: 20) The default page size to use if `first` and `last` are not provided.
- `maxSize`: (default: 100) The maximum number of nodes returned for a connection.
- `resolve`: Like the resolver for `prismaField`, the first argument is a `query` object that should be spread into your prisma query. The `resolve` function should return an array of nodes for the connection. The `query` will contain the correct `take`, `skip`, and `cursor` options based on the connection arguments (`before`, `after`, `first`, `last`), along with `include` options for nested selections.
- `totalCount`: A function for loading the total count for the connection. This will add a `totalCount` field to the connection object. The `totalCount` method will receive (`connection`, `args`, `context`, `info`) as arguments. Note that this will not work when using a shared connection object (see details below)

The created connection queries currently support the following combinations of connection arguments:

- `first`, `last`, or `before`
- `first` and `before`
- `last` and `after`

Queries for other combinations are not as useful, and generally requiring loading all records between 2 cursors, or between a cursor and the end of the set. Generating query options for these cases is more complex and likely very inefficient, so they will currently throw an Error indicating the argument combinations are not supported.

The `maxSize` and `defaultSize` can also be configured globally using `maxConnectionSize` and `defaultConnectionSize` options in the `prisma` plugin options.

### [`relatedConnection`](https://pothos-graphql.dev/docs/plugins/prisma/connections#relatedconnection)

The `relatedConnection` method can be used to create a relay `connection` field based on a relation of the current model.

#### [options](https://pothos-graphql.dev/docs/plugins/prisma/connections#options-1)

- `cursor`: a `@unique` column of the model being connected to. This is used as the `cursor` option passed to prisma.
- `defaultSize`: (default: 20) The default page size to use if `first` and `last` are not provided.
- `maxSize`: (default: 100) The maximum number of nodes returned for a connection.
- `query`: A method that accepts the `args` and `context` for the connection field, and returns filtering and sorting logic that will be merged into the query for the relation.
- `totalCount`: when set to true, this will add a `totalCount` field to the connection object. see `relationCount` above for more details. Note that this will not work when using a shared connection object (see details below)

### [Indirect relations as connections](https://pothos-graphql.dev/docs/plugins/prisma/connections#indirect-relations-as-connections)

Creating connections from indirect relations is a little more involved, but can be achieved using `prismaConnectionHelpers` with a normal `t.connection` field.

The above example assumes that you are paginating a relation to a join table, where the pagination args are applied based on the relation to that join table, but the nodes themselves are nested deeper.

`prismaConnectionHelpers` can also be used to manually create a connection where the edge and connections share the same model, and pagination happens directly on a relation to nodes type (even if that relation is nested).

To add arguments for a connection defined with a helper, it is often easiest to define the arguments on the connection field rather than the connection helper. This allows connection helpers to be shared between fields that may not share the same arguments:

Arguments, ordering and filtering can also be defined on the helpers themselves:

### [Sharing Connections objects](https://pothos-graphql.dev/docs/plugins/prisma/connections#sharing-connections-objects)

You can create reusable connection objects by using `builder.connectionObject`.

These connection objects can be used with `t.prismaConnection`, `t.relatedConnection`, or `t.connection`

Shared edges can also be created using `t.edgeObject`

### [Extending connection edges](https://pothos-graphql.dev/docs/plugins/prisma/connections#extending-connection-edges)

In some cases you may want to expose some data from an indirect connection on the edge object.

### [Total count on shared connection objects](https://pothos-graphql.dev/docs/plugins/prisma/connections#total-count-on-shared-connection-objects)

If you are set the `totalCount: true` on a `prismaConnection` or `relatedConnection` field, and are using a custom connection object, you will need to manually add the `totalCount` field to the connection object manually. The parent object on the connection will have a `totalCount` property that is either a the totalCount, or a function that will return the totalCount.

If you want to add a global `totalCount` field, you can do something similar using `builder.globalConnectionField`:

### [`parsePrismaCursor` and `formatPrismaCursor`](https://pothos-graphql.dev/docs/plugins/prisma/connections#parseprismacursor-and-formatprismacursor)

These functions can be used to manually parse and format cursors that are compatible with prisma connections.

Parsing a cursor will return the value from the column used for the cursor (often the `id`), this value may be an array or object when a compound index is used as the cursor. Similarly, to format a cursor, you must provide the column(s) that make up the cursor.

---

## URL: https://pothos-graphql.dev/docs/plugins/prisma/connections#total-count-on-shared-connection-objects

Title: Connections

URL Source: https://pothos-graphql.dev/docs/plugins/prisma/connections

Markdown Content:

### [`prismaConnection`](https://pothos-graphql.dev/docs/plugins/prisma/connections#prismaconnection)

The `prismaConnection` method on a field builder can be used to create a relay `connection` field that also pre-loads all the data nested inside that connection.

#### [options](https://pothos-graphql.dev/docs/plugins/prisma/connections#options)

- `type`: the name of the prisma model being connected to
- `cursor`: a `@unique` column of the model being connected to. This is used as the `cursor` option passed to prisma.
- `defaultSize`: (default: 20) The default page size to use if `first` and `last` are not provided.
- `maxSize`: (default: 100) The maximum number of nodes returned for a connection.
- `resolve`: Like the resolver for `prismaField`, the first argument is a `query` object that should be spread into your prisma query. The `resolve` function should return an array of nodes for the connection. The `query` will contain the correct `take`, `skip`, and `cursor` options based on the connection arguments (`before`, `after`, `first`, `last`), along with `include` options for nested selections.
- `totalCount`: A function for loading the total count for the connection. This will add a `totalCount` field to the connection object. The `totalCount` method will receive (`connection`, `args`, `context`, `info`) as arguments. Note that this will not work when using a shared connection object (see details below)

The created connection queries currently support the following combinations of connection arguments:

- `first`, `last`, or `before`
- `first` and `before`
- `last` and `after`

Queries for other combinations are not as useful, and generally requiring loading all records between 2 cursors, or between a cursor and the end of the set. Generating query options for these cases is more complex and likely very inefficient, so they will currently throw an Error indicating the argument combinations are not supported.

The `maxSize` and `defaultSize` can also be configured globally using `maxConnectionSize` and `defaultConnectionSize` options in the `prisma` plugin options.

### [`relatedConnection`](https://pothos-graphql.dev/docs/plugins/prisma/connections#relatedconnection)

The `relatedConnection` method can be used to create a relay `connection` field based on a relation of the current model.

#### [options](https://pothos-graphql.dev/docs/plugins/prisma/connections#options-1)

- `cursor`: a `@unique` column of the model being connected to. This is used as the `cursor` option passed to prisma.
- `defaultSize`: (default: 20) The default page size to use if `first` and `last` are not provided.
- `maxSize`: (default: 100) The maximum number of nodes returned for a connection.
- `query`: A method that accepts the `args` and `context` for the connection field, and returns filtering and sorting logic that will be merged into the query for the relation.
- `totalCount`: when set to true, this will add a `totalCount` field to the connection object. see `relationCount` above for more details. Note that this will not work when using a shared connection object (see details below)

### [Indirect relations as connections](https://pothos-graphql.dev/docs/plugins/prisma/connections#indirect-relations-as-connections)

Creating connections from indirect relations is a little more involved, but can be achieved using `prismaConnectionHelpers` with a normal `t.connection` field.

The above example assumes that you are paginating a relation to a join table, where the pagination args are applied based on the relation to that join table, but the nodes themselves are nested deeper.

`prismaConnectionHelpers` can also be used to manually create a connection where the edge and connections share the same model, and pagination happens directly on a relation to nodes type (even if that relation is nested).

To add arguments for a connection defined with a helper, it is often easiest to define the arguments on the connection field rather than the connection helper. This allows connection helpers to be shared between fields that may not share the same arguments:

Arguments, ordering and filtering can also be defined on the helpers themselves:

### [Sharing Connections objects](https://pothos-graphql.dev/docs/plugins/prisma/connections#sharing-connections-objects)

You can create reusable connection objects by using `builder.connectionObject`.

These connection objects can be used with `t.prismaConnection`, `t.relatedConnection`, or `t.connection`

Shared edges can also be created using `t.edgeObject`

### [Extending connection edges](https://pothos-graphql.dev/docs/plugins/prisma/connections#extending-connection-edges)

In some cases you may want to expose some data from an indirect connection on the edge object.

### [Total count on shared connection objects](https://pothos-graphql.dev/docs/plugins/prisma/connections#total-count-on-shared-connection-objects)

If you are set the `totalCount: true` on a `prismaConnection` or `relatedConnection` field, and are using a custom connection object, you will need to manually add the `totalCount` field to the connection object manually. The parent object on the connection will have a `totalCount` property that is either a the totalCount, or a function that will return the totalCount.

If you want to add a global `totalCount` field, you can do something similar using `builder.globalConnectionField`:

### [`parsePrismaCursor` and `formatPrismaCursor`](https://pothos-graphql.dev/docs/plugins/prisma/connections#parseprismacursor-and-formatprismacursor)

These functions can be used to manually parse and format cursors that are compatible with prisma connections.

Parsing a cursor will return the value from the column used for the cursor (often the `id`), this value may be an array or object when a compound index is used as the cursor. Similarly, to format a cursor, you must provide the column(s) that make up the cursor.

---

## URL: https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils#creating-filters-for-prisma-objects-compatible-with-a-where-clause

Title: Prisma Utils

URL Source: https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils

Markdown Content:
This package is highly experimental and not recommended for production use

The plugin adds new helpers for creating prisma compatible input types. It is NOT required to use the normal prisma plugin.

To use this plugin, you will need to enable prismaUtils option in the generator in your schema.prisma:

Once this is enabled, you can add the plugin to your schema along with the normal prisma plugin:

Currently this plugin is focused on making it easier to define prisma compatible input types that take advantage of the types defined in your Prisma schema.

The goal is not to generate all input types automatically, but rather to provide building blocks so that writing your own helpers or code-generators becomes a lot easier. There are far too many tradeoffs and choices to be made when designing input types for queries that one solution won't work for everyone.

This plugin will eventually provide more helpers and examples that should allow anyone to quickly set something up to automatically creates all their input types (and eventually other crud operations).

### [Creating filter types for scalars and enums](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils#creating-filter-types-for-scalars-and-enums)

### [Creating filters for Prisma objects (compatible with a "where" clause)](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils#creating-filters-for-prisma-objects-compatible-with-a-where-clause)

### [Creating list filters for scalars](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils#creating-list-filters-for-scalars)

### [Creating list filters for Prisma objects](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils#creating-list-filters-for-prisma-objects)

### [Creating OrderBy input types](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils#creating-orderby-input-types)

### [Inputs for create mutations](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils#inputs-for-create-mutations)

You can use `builder.prismaCreate` to create input types for create mutations.

To get these types to work correctly for circular references, it is recommended to add explicit type annotations, but for simple types that do not have circular references the explicit types can be omitted.

### [Inputs for update mutations](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils#inputs-for-update-mutations)

You can use `builder.prismaUpdate` to Update input types for update mutations.

To get these types to work correctly for circular references, it is recommended to add explicit type annotations, but for simple types that do not have circular references the explicit types can be omitted.

#### [Atomic Int Update operations](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils#atomic-int-update-operations)

Manually defining all the different input types shown above for a large number of tables can become very repetitive. These utilities are designed to be building blocks for generators or utility functions, so that you don't need to hand write these types yourself.

Pothos does not currently ship an official generator for prisma types, but there are a couple of example generators that can be copied and modified to suite your needs. These are intentionally somewhat limited in functionality and not written to be easily exported because they will be updated with breaking changes as these utilities are developed further. They are only intended as building blocks for you to build you own generators.

There are 2 main approaches:

1.  Static Generation: Types are generated and written as a typescript file which can be imported from as part of your schema
2.  Dynamic Generation: Types are generated dynamically at runtime through helpers imported from your App

### [Static generator](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils#static-generator)

You can find an [example static generator here](https://github.com/hayes/pothos/blob/main/packages/plugin-prisma-utils/tests/examples/codegen/generator.ts)

This generator will generate a file with input types for every table in your schema as shown [here](https://github.com/hayes/pothos/blob/main/packages/plugin-prisma-utils/tests/examples/codegen/schema/prisma-inputs.ts)

These generated types can be used in your schema as shown [here](https://github.com/hayes/pothos/blob/main/packages/plugin-prisma-utils/tests/examples/codegen/schema/index.ts)

### [Dynamic generator](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils#dynamic-generator)

You can find an example [dynamic generator here](https://github.com/hayes/pothos/blob/main/packages/plugin-prisma-utils/tests/examples/crud/generator.ts)

This generator exports a class that can be used to dynamically create input types for your builder as shown [here](https://github.com/hayes/pothos/blob/main/packages/plugin-prisma-utils/tests/examples/crud/schema/index.ts#L9-L20)

---

## URL: https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils#inputs-for-create-mutations

Title: Prisma Utils

URL Source: https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils

Markdown Content:
This package is highly experimental and not recommended for production use

The plugin adds new helpers for creating prisma compatible input types. It is NOT required to use the normal prisma plugin.

To use this plugin, you will need to enable prismaUtils option in the generator in your schema.prisma:

Once this is enabled, you can add the plugin to your schema along with the normal prisma plugin:

Currently this plugin is focused on making it easier to define prisma compatible input types that take advantage of the types defined in your Prisma schema.

The goal is not to generate all input types automatically, but rather to provide building blocks so that writing your own helpers or code-generators becomes a lot easier. There are far too many tradeoffs and choices to be made when designing input types for queries that one solution won't work for everyone.

This plugin will eventually provide more helpers and examples that should allow anyone to quickly set something up to automatically creates all their input types (and eventually other crud operations).

### [Creating filter types for scalars and enums](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils#creating-filter-types-for-scalars-and-enums)

### [Creating filters for Prisma objects (compatible with a "where" clause)](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils#creating-filters-for-prisma-objects-compatible-with-a-where-clause)

### [Creating list filters for scalars](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils#creating-list-filters-for-scalars)

### [Creating list filters for Prisma objects](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils#creating-list-filters-for-prisma-objects)

### [Creating OrderBy input types](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils#creating-orderby-input-types)

### [Inputs for create mutations](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils#inputs-for-create-mutations)

You can use `builder.prismaCreate` to create input types for create mutations.

To get these types to work correctly for circular references, it is recommended to add explicit type annotations, but for simple types that do not have circular references the explicit types can be omitted.

### [Inputs for update mutations](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils#inputs-for-update-mutations)

You can use `builder.prismaUpdate` to Update input types for update mutations.

To get these types to work correctly for circular references, it is recommended to add explicit type annotations, but for simple types that do not have circular references the explicit types can be omitted.

#### [Atomic Int Update operations](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils#atomic-int-update-operations)

Manually defining all the different input types shown above for a large number of tables can become very repetitive. These utilities are designed to be building blocks for generators or utility functions, so that you don't need to hand write these types yourself.

Pothos does not currently ship an official generator for prisma types, but there are a couple of example generators that can be copied and modified to suite your needs. These are intentionally somewhat limited in functionality and not written to be easily exported because they will be updated with breaking changes as these utilities are developed further. They are only intended as building blocks for you to build you own generators.

There are 2 main approaches:

1.  Static Generation: Types are generated and written as a typescript file which can be imported from as part of your schema
2.  Dynamic Generation: Types are generated dynamically at runtime through helpers imported from your App

### [Static generator](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils#static-generator)

You can find an [example static generator here](https://github.com/hayes/pothos/blob/main/packages/plugin-prisma-utils/tests/examples/codegen/generator.ts)

This generator will generate a file with input types for every table in your schema as shown [here](https://github.com/hayes/pothos/blob/main/packages/plugin-prisma-utils/tests/examples/codegen/schema/prisma-inputs.ts)

These generated types can be used in your schema as shown [here](https://github.com/hayes/pothos/blob/main/packages/plugin-prisma-utils/tests/examples/codegen/schema/index.ts)

### [Dynamic generator](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils#dynamic-generator)

You can find an example [dynamic generator here](https://github.com/hayes/pothos/blob/main/packages/plugin-prisma-utils/tests/examples/crud/generator.ts)

This generator exports a class that can be used to dynamically create input types for your builder as shown [here](https://github.com/hayes/pothos/blob/main/packages/plugin-prisma-utils/tests/examples/crud/schema/index.ts#L9-L20)

---

## URL: https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils#dynamic-generator

Title: Prisma Utils

URL Source: https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils

Markdown Content:
This package is highly experimental and not recommended for production use

The plugin adds new helpers for creating prisma compatible input types. It is NOT required to use the normal prisma plugin.

To use this plugin, you will need to enable prismaUtils option in the generator in your schema.prisma:

Once this is enabled, you can add the plugin to your schema along with the normal prisma plugin:

Currently this plugin is focused on making it easier to define prisma compatible input types that take advantage of the types defined in your Prisma schema.

The goal is not to generate all input types automatically, but rather to provide building blocks so that writing your own helpers or code-generators becomes a lot easier. There are far too many tradeoffs and choices to be made when designing input types for queries that one solution won't work for everyone.

This plugin will eventually provide more helpers and examples that should allow anyone to quickly set something up to automatically creates all their input types (and eventually other crud operations).

### [Creating filter types for scalars and enums](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils#creating-filter-types-for-scalars-and-enums)

### [Creating filters for Prisma objects (compatible with a "where" clause)](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils#creating-filters-for-prisma-objects-compatible-with-a-where-clause)

### [Creating list filters for scalars](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils#creating-list-filters-for-scalars)

### [Creating list filters for Prisma objects](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils#creating-list-filters-for-prisma-objects)

### [Creating OrderBy input types](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils#creating-orderby-input-types)

### [Inputs for create mutations](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils#inputs-for-create-mutations)

You can use `builder.prismaCreate` to create input types for create mutations.

To get these types to work correctly for circular references, it is recommended to add explicit type annotations, but for simple types that do not have circular references the explicit types can be omitted.

### [Inputs for update mutations](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils#inputs-for-update-mutations)

You can use `builder.prismaUpdate` to Update input types for update mutations.

To get these types to work correctly for circular references, it is recommended to add explicit type annotations, but for simple types that do not have circular references the explicit types can be omitted.

#### [Atomic Int Update operations](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils#atomic-int-update-operations)

Manually defining all the different input types shown above for a large number of tables can become very repetitive. These utilities are designed to be building blocks for generators or utility functions, so that you don't need to hand write these types yourself.

Pothos does not currently ship an official generator for prisma types, but there are a couple of example generators that can be copied and modified to suite your needs. These are intentionally somewhat limited in functionality and not written to be easily exported because they will be updated with breaking changes as these utilities are developed further. They are only intended as building blocks for you to build you own generators.

There are 2 main approaches:

1.  Static Generation: Types are generated and written as a typescript file which can be imported from as part of your schema
2.  Dynamic Generation: Types are generated dynamically at runtime through helpers imported from your App

### [Static generator](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils#static-generator)

You can find an [example static generator here](https://github.com/hayes/pothos/blob/main/packages/plugin-prisma-utils/tests/examples/codegen/generator.ts)

This generator will generate a file with input types for every table in your schema as shown [here](https://github.com/hayes/pothos/blob/main/packages/plugin-prisma-utils/tests/examples/codegen/schema/prisma-inputs.ts)

These generated types can be used in your schema as shown [here](https://github.com/hayes/pothos/blob/main/packages/plugin-prisma-utils/tests/examples/codegen/schema/index.ts)

### [Dynamic generator](https://pothos-graphql.dev/docs/plugins/prisma/prisma-utils#dynamic-generator)

You can find an example [dynamic generator here](https://github.com/hayes/pothos/blob/main/packages/plugin-prisma-utils/tests/examples/crud/generator.ts)

This generator exports a class that can be used to dynamically create input types for your builder as shown [here](https://github.com/hayes/pothos/blob/main/packages/plugin-prisma-utils/tests/examples/crud/schema/index.ts#L9-L20)

---

## URL: https://pothos-graphql.dev/docs/api/field-builder#return-type

Title: FieldBuilder

URL Source: https://pothos-graphql.dev/docs/api/field-builder

Markdown Content:
Api

- `options`: `FieldOptions`

### [FieldOptions](https://pothos-graphql.dev/docs/api/field-builder#fieldoptions-1)

- `type`: [Type Parameter](https://pothos-graphql.dev/docs/api/field-builder#type-parameter)

- `args`: a map of arg name to arg values. Arg values can be created using an [`InputFieldBuilder`](https://pothos-graphql.dev/docs/api/input-field-builder)

(`fieldBuilder.arg`) or using `schemaBuilder.args`

- `nullable`: boolean, defaults to `true`, unless overwritten in SchemaBuilder see [Changing Default Nullability](https://pothos-graphql.dev/docs/guide/changing-default-nullability).

- `description`: string

- `deprecationReason`: string

- `resolve`: [Resolver](https://pothos-graphql.dev/docs/api/field-builder#resolver)

### [Type Parameter](https://pothos-graphql.dev/docs/api/field-builder#type-parameter)

A Type Parameter for a Field can be any `TypeRef` returned by one of the [`SchemaBuilder`](https://pothos-graphql.dev/docs/api/schema-builder) methods for defining a type, a class used to create an object or interface type, a ts enum used to define a graphql enum type, or a string that corresponds to one of they keys of the `Objects`, `Interfaces`, or `Scalars` objects defined in `SchemaTypes`.

For List fields, the Type Parameter should be one of the above wrapped in an array eg `['User']`.

### [Resolver](https://pothos-graphql.dev/docs/api/field-builder#resolver)

A function to resolve the value of this field.

#### [Return type](https://pothos-graphql.dev/docs/api/field-builder#return-type)

Field resolvers should return a value (or promise) that matches the expected type for this field. For `Scalars`, `Objects`, and `Interfaces` this type is the corresponding type defined `SchemaTypes`. For Unions, the type may be any of the corresponding shapes of members of the union. For Enums, the value is dependent on the implementation of the enum. See `Enum` guide for more details.

#### [Args](https://pothos-graphql.dev/docs/api/field-builder#args)

- `parent`: Parent will be a value of the backing model for the current type specified in

`SchemaTypes`.

- `args`: an object matching the shape of the args option for the current field

- `context`: The type `Context` type defined in `SchemaTypes`.

- `info`: a GraphQLResolveInfo object see

[https://graphql.org/graphql-js/type/#graphqlobjecttype](https://graphql.org/graphql-js/type/#graphqlobjecttype)

for more details.

A set of helpers for creating scalar fields. This work the same as [`field`](https://pothos-graphql.dev/docs/api/field-builder#fieldoptions), but omit the `type` field from options.

### [Scalars](https://pothos-graphql.dev/docs/api/field-builder#scalars)

- `string(options)`
- `id(options)`
- `boolean(options)`
- `int(options)`
- `float(options)`
- `stringList(options)`
- `idList(options)`
- `booleanList(options)`
- `intList(options)`
- `floatList(options)`
- `listRef(type, options)`

### [expose](https://pothos-graphql.dev/docs/api/field-builder#expose)

A set of helpers to expose fields from the backing model. The `name` arg can be any field from the backing model that matches the type being exposed. Options are the same as [`field`](https://pothos-graphql.dev/docs/api/field-builder#fieldoptions), but `type` and `resolve` are omitted.

- `exposeString(name, options)`
- `exposeID(name, options)`
- `exposeBoolean(name, options)`
- `exposeInt(name, options)`
- `exposeFloat(name, options)`
- `exposeStringList(name, options)`
- `exposeIDList(name, options)`
- `exposeBooleanList(name, options)`
- `exposeIntList(name, options)`
- `exposeFloatList(name, options)`

---

## URL: https://pothos-graphql.dev/docs/api/field-builder#fieldoptions

Title: FieldBuilder

URL Source: https://pothos-graphql.dev/docs/api/field-builder

Markdown Content:
Api

- `options`: `FieldOptions`

### [FieldOptions](https://pothos-graphql.dev/docs/api/field-builder#fieldoptions-1)

- `type`: [Type Parameter](https://pothos-graphql.dev/docs/api/field-builder#type-parameter)

- `args`: a map of arg name to arg values. Arg values can be created using an [`InputFieldBuilder`](https://pothos-graphql.dev/docs/api/input-field-builder)

(`fieldBuilder.arg`) or using `schemaBuilder.args`

- `nullable`: boolean, defaults to `true`, unless overwritten in SchemaBuilder see [Changing Default Nullability](https://pothos-graphql.dev/docs/guide/changing-default-nullability).

- `description`: string

- `deprecationReason`: string

- `resolve`: [Resolver](https://pothos-graphql.dev/docs/api/field-builder#resolver)

### [Type Parameter](https://pothos-graphql.dev/docs/api/field-builder#type-parameter)

A Type Parameter for a Field can be any `TypeRef` returned by one of the [`SchemaBuilder`](https://pothos-graphql.dev/docs/api/schema-builder) methods for defining a type, a class used to create an object or interface type, a ts enum used to define a graphql enum type, or a string that corresponds to one of they keys of the `Objects`, `Interfaces`, or `Scalars` objects defined in `SchemaTypes`.

For List fields, the Type Parameter should be one of the above wrapped in an array eg `['User']`.

### [Resolver](https://pothos-graphql.dev/docs/api/field-builder#resolver)

A function to resolve the value of this field.

#### [Return type](https://pothos-graphql.dev/docs/api/field-builder#return-type)

Field resolvers should return a value (or promise) that matches the expected type for this field. For `Scalars`, `Objects`, and `Interfaces` this type is the corresponding type defined `SchemaTypes`. For Unions, the type may be any of the corresponding shapes of members of the union. For Enums, the value is dependent on the implementation of the enum. See `Enum` guide for more details.

#### [Args](https://pothos-graphql.dev/docs/api/field-builder#args)

- `parent`: Parent will be a value of the backing model for the current type specified in

`SchemaTypes`.

- `args`: an object matching the shape of the args option for the current field

- `context`: The type `Context` type defined in `SchemaTypes`.

- `info`: a GraphQLResolveInfo object see

[https://graphql.org/graphql-js/type/#graphqlobjecttype](https://graphql.org/graphql-js/type/#graphqlobjecttype)

for more details.

A set of helpers for creating scalar fields. This work the same as [`field`](https://pothos-graphql.dev/docs/api/field-builder#fieldoptions), but omit the `type` field from options.

### [Scalars](https://pothos-graphql.dev/docs/api/field-builder#scalars)

- `string(options)`
- `id(options)`
- `boolean(options)`
- `int(options)`
- `float(options)`
- `stringList(options)`
- `idList(options)`
- `booleanList(options)`
- `intList(options)`
- `floatList(options)`
- `listRef(type, options)`

### [expose](https://pothos-graphql.dev/docs/api/field-builder#expose)

A set of helpers to expose fields from the backing model. The `name` arg can be any field from the backing model that matches the type being exposed. Options are the same as [`field`](https://pothos-graphql.dev/docs/api/field-builder#fieldoptions), but `type` and `resolve` are omitted.

- `exposeString(name, options)`
- `exposeID(name, options)`
- `exposeBoolean(name, options)`
- `exposeInt(name, options)`
- `exposeFloat(name, options)`
- `exposeStringList(name, options)`
- `exposeIDList(name, options)`
- `exposeBooleanList(name, options)`
- `exposeIntList(name, options)`
- `exposeFloatList(name, options)`

---

## URL: https://pothos-graphql.dev/docs/api/field-builder#scalars

Title: FieldBuilder

URL Source: https://pothos-graphql.dev/docs/api/field-builder

Markdown Content:
Api

- `options`: `FieldOptions`

### [FieldOptions](https://pothos-graphql.dev/docs/api/field-builder#fieldoptions-1)

- `type`: [Type Parameter](https://pothos-graphql.dev/docs/api/field-builder#type-parameter)

- `args`: a map of arg name to arg values. Arg values can be created using an [`InputFieldBuilder`](https://pothos-graphql.dev/docs/api/input-field-builder)

(`fieldBuilder.arg`) or using `schemaBuilder.args`

- `nullable`: boolean, defaults to `true`, unless overwritten in SchemaBuilder see [Changing Default Nullability](https://pothos-graphql.dev/docs/guide/changing-default-nullability).

- `description`: string

- `deprecationReason`: string

- `resolve`: [Resolver](https://pothos-graphql.dev/docs/api/field-builder#resolver)

### [Type Parameter](https://pothos-graphql.dev/docs/api/field-builder#type-parameter)

A Type Parameter for a Field can be any `TypeRef` returned by one of the [`SchemaBuilder`](https://pothos-graphql.dev/docs/api/schema-builder) methods for defining a type, a class used to create an object or interface type, a ts enum used to define a graphql enum type, or a string that corresponds to one of they keys of the `Objects`, `Interfaces`, or `Scalars` objects defined in `SchemaTypes`.

For List fields, the Type Parameter should be one of the above wrapped in an array eg `['User']`.

### [Resolver](https://pothos-graphql.dev/docs/api/field-builder#resolver)

A function to resolve the value of this field.

#### [Return type](https://pothos-graphql.dev/docs/api/field-builder#return-type)

Field resolvers should return a value (or promise) that matches the expected type for this field. For `Scalars`, `Objects`, and `Interfaces` this type is the corresponding type defined `SchemaTypes`. For Unions, the type may be any of the corresponding shapes of members of the union. For Enums, the value is dependent on the implementation of the enum. See `Enum` guide for more details.

#### [Args](https://pothos-graphql.dev/docs/api/field-builder#args)

- `parent`: Parent will be a value of the backing model for the current type specified in

`SchemaTypes`.

- `args`: an object matching the shape of the args option for the current field

- `context`: The type `Context` type defined in `SchemaTypes`.

- `info`: a GraphQLResolveInfo object see

[https://graphql.org/graphql-js/type/#graphqlobjecttype](https://graphql.org/graphql-js/type/#graphqlobjecttype)

for more details.

A set of helpers for creating scalar fields. This work the same as [`field`](https://pothos-graphql.dev/docs/api/field-builder#fieldoptions), but omit the `type` field from options.

### [Scalars](https://pothos-graphql.dev/docs/api/field-builder#scalars)

- `string(options)`
- `id(options)`
- `boolean(options)`
- `int(options)`
- `float(options)`
- `stringList(options)`
- `idList(options)`
- `booleanList(options)`
- `intList(options)`
- `floatList(options)`
- `listRef(type, options)`

### [expose](https://pothos-graphql.dev/docs/api/field-builder#expose)

A set of helpers to expose fields from the backing model. The `name` arg can be any field from the backing model that matches the type being exposed. Options are the same as [`field`](https://pothos-graphql.dev/docs/api/field-builder#fieldoptions), but `type` and `resolve` are omitted.

- `exposeString(name, options)`
- `exposeID(name, options)`
- `exposeBoolean(name, options)`
- `exposeInt(name, options)`
- `exposeFloat(name, options)`
- `exposeStringList(name, options)`
- `exposeIDList(name, options)`
- `exposeBooleanList(name, options)`
- `exposeIntList(name, options)`
- `exposeFloatList(name, options)`

---

## URL: https://pothos-graphql.dev/docs/api/field-builder#expose

Title: FieldBuilder

URL Source: https://pothos-graphql.dev/docs/api/field-builder

Markdown Content:
Api

- `options`: `FieldOptions`

### [FieldOptions](https://pothos-graphql.dev/docs/api/field-builder#fieldoptions-1)

- `type`: [Type Parameter](https://pothos-graphql.dev/docs/api/field-builder#type-parameter)

- `args`: a map of arg name to arg values. Arg values can be created using an [`InputFieldBuilder`](https://pothos-graphql.dev/docs/api/input-field-builder)

(`fieldBuilder.arg`) or using `schemaBuilder.args`

- `nullable`: boolean, defaults to `true`, unless overwritten in SchemaBuilder see [Changing Default Nullability](https://pothos-graphql.dev/docs/guide/changing-default-nullability).

- `description`: string

- `deprecationReason`: string

- `resolve`: [Resolver](https://pothos-graphql.dev/docs/api/field-builder#resolver)

### [Type Parameter](https://pothos-graphql.dev/docs/api/field-builder#type-parameter)

A Type Parameter for a Field can be any `TypeRef` returned by one of the [`SchemaBuilder`](https://pothos-graphql.dev/docs/api/schema-builder) methods for defining a type, a class used to create an object or interface type, a ts enum used to define a graphql enum type, or a string that corresponds to one of they keys of the `Objects`, `Interfaces`, or `Scalars` objects defined in `SchemaTypes`.

For List fields, the Type Parameter should be one of the above wrapped in an array eg `['User']`.

### [Resolver](https://pothos-graphql.dev/docs/api/field-builder#resolver)

A function to resolve the value of this field.

#### [Return type](https://pothos-graphql.dev/docs/api/field-builder#return-type)

Field resolvers should return a value (or promise) that matches the expected type for this field. For `Scalars`, `Objects`, and `Interfaces` this type is the corresponding type defined `SchemaTypes`. For Unions, the type may be any of the corresponding shapes of members of the union. For Enums, the value is dependent on the implementation of the enum. See `Enum` guide for more details.

#### [Args](https://pothos-graphql.dev/docs/api/field-builder#args)

- `parent`: Parent will be a value of the backing model for the current type specified in

`SchemaTypes`.

- `args`: an object matching the shape of the args option for the current field

- `context`: The type `Context` type defined in `SchemaTypes`.

- `info`: a GraphQLResolveInfo object see

[https://graphql.org/graphql-js/type/#graphqlobjecttype](https://graphql.org/graphql-js/type/#graphqlobjecttype)

for more details.

A set of helpers for creating scalar fields. This work the same as [`field`](https://pothos-graphql.dev/docs/api/field-builder#fieldoptions), but omit the `type` field from options.

### [Scalars](https://pothos-graphql.dev/docs/api/field-builder#scalars)

- `string(options)`
- `id(options)`
- `boolean(options)`
- `int(options)`
- `float(options)`
- `stringList(options)`
- `idList(options)`
- `booleanList(options)`
- `intList(options)`
- `floatList(options)`
- `listRef(type, options)`

### [expose](https://pothos-graphql.dev/docs/api/field-builder#expose)

A set of helpers to expose fields from the backing model. The `name` arg can be any field from the backing model that matches the type being exposed. Options are the same as [`field`](https://pothos-graphql.dev/docs/api/field-builder#fieldoptions), but `type` and `resolve` are omitted.

- `exposeString(name, options)`
- `exposeID(name, options)`
- `exposeBoolean(name, options)`
- `exposeInt(name, options)`
- `exposeFloat(name, options)`
- `exposeStringList(name, options)`
- `exposeIDList(name, options)`
- `exposeBooleanList(name, options)`
- `exposeIntList(name, options)`
- `exposeFloatList(name, options)`

---

# Crawl Statistics

- **Source:** https://pothos-graphql.dev/docs/
- **Depth:** 5
- **Pages processed:** 406
- **Crawl method:** api
- **Duration:** 434.83 seconds
- **Crawl completed:** 21/06/2025, 08:11:46
