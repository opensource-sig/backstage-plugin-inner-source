import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { synergyPlugin, SynergyPage } from '../src/plugin';

createDevApp()
  .registerPlugin(synergyPlugin)
  .addPage({
    element: <SynergyPage />,
    title: 'Root Page',
    path: '/innersource',
  })
  .render();
