# Setup

## Backend

Add the plugin to your backend app:

```bash
yarn workspace backend add  @jiteshy/backstage-plugin-innersource-backend
```

In your `packages/backend/src/index.ts` make the following changes:

```ts
import { createBackend } from '@backstage/backend-defaults';
const backend = createBackend();
// ... other plugins
backend.add(import('@jiteshy/backstage-plugin-synergy-backend'));
backend.start();
```

## Frontend

Add the plugin to your frontend app:

```bash
yarn workspace app add @jiteshy/backstage-plugin-innersource
```

Expose the Synergy page:

```ts
// packages/app/src/App.tsx
import { SynergyPage } from '@jiteshy/backstage-plugin-innersource';

// ...

const AppRoutes = () => (
  <FlatRoutes>
    // ...
    <Route path="/innersource" element={<SynergyPage />} />
    // ...
  </FlatRoutes>
);
```

Add the navigation in the frontend:

```ts
// packages/app/src/components/Root/Root.tsx
import DeviceHubOutlined from '@material-ui/icons/DeviceHubOutlined';
// ...
export const Root = ({ children }: PropsWithChildren<{}>) => (
  <SidebarPage>
    // ...
    <SidebarItem icon={DeviceHubOutlined} to="innersource" text="Synergy" />
    // ...
  </SidebarPage>
);
```

An interface for Synergy is now available at `/synergy`.
