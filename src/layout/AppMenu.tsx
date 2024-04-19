/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';

import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';

import Link from 'next/link';
import { AppMenuItem } from '@/types';



const AppMenu = () => {
  const { layoutConfig } = useContext(LayoutContext);

  const model: AppMenuItem[] = [
    {
      label: 'Home',
      items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/dashboard' }]
    },
    {
      label: 'Cadastro',
      items: [
        { label: 'Buckets', icon: 'pi pi-fw pi-id-card', to: '/bucket' },
        { label: 'Proprietários', icon: 'pi pi-fw pi-check-square', to: '/owner' },
        { label: 'Clientes', icon: 'pi pi-fw pi-bookmark', to: '/uikit/floatlabel' },
        { label: 'Intervalos', icon: 'pi pi-fw pi-clock', to: '/uikit/button', class: 'rotated-icon' },
        { label: 'Tipos de serviço', icon: 'pi pi-fw pi-table', to: '/uikit/table' },
        { label: 'Atendimentos confirmado', icon: 'pi pi-fw pi-list', to: '/uikit/list' },
        { label: 'Convênios', icon: 'pi pi-fw pi-share-alt', to: '/uikit/tree' },
        { label: 'Regras', icon: 'pi pi-fw pi-tablet', to: '/uikit/panel' },
        { label: 'Usuários', icon: 'pi pi-fw pi-user', to: '/uikit/overlay' },
      ]
    },
    {
      label: 'Ligações',
      items: [
        { label: 'Ver chamadas', icon: 'pi pi-fw pi-eye', to: '/blocks', badge: 'NEW' },
      ]
    },
    {
      label: 'Utilitários',
      items: [
        { label: 'Perfil', icon: 'pi pi-fw pi-prime', to: '/utilities/icons' },
      ]
    }
  ];

  return (
    <MenuProvider>
      <ul className="layout-menu">
        {model.map((item, i) => {
          return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
        })}
      </ul>
    </MenuProvider>
  );
};

export default AppMenu;
