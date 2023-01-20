import React, { useState } from 'react';
import {
  CanAccess,
  ITreeMenu,
  useGetIdentity,
  useIsExistAuthentication,
  useLogout,
  useMenu,
  useRefineContext,
  useRouterContext,
  useTitle,
  useTranslate,
} from '@pankod/refine-core';
import {
  ActionIcon,
  Box,
  Drawer,
  Navbar,
  NavLink,
  NavLinkStylesNames,
  NavLinkStylesParams,
  ScrollArea,
  MediaQuery,
  Tooltip,
  TooltipProps,
  Styles,
  RefineTitle as DefaultTitle,
  useMantineTheme,
} from '@pankod/refine-mantine';
import type { RefineLayoutSiderProps } from '@pankod/refine-mantine';

// We use @tabler/icons for icons but you can use any icon library you want.
import {
  IconList,
  IconMenu2,
  IconLogout,
  IconDashboard,
  IconBook,
} from '@tabler/icons';
import { UserButton } from './UserButton';

const defaultNavIcon = <IconList size={18} />;

export const Sider: React.FC<RefineLayoutSiderProps> = ({ render }) => {
  const theme = useMantineTheme();
  const collapsed = false;
  const [opened, setOpened] = useState(false);

  const { Link } = useRouterContext();
  const { defaultOpenKeys, menuItems, selectedKey } = useMenu();
  const Title = useTitle();
  const isExistAuthentication = useIsExistAuthentication();
  const t = useTranslate();
  const { hasDashboard } = useRefineContext();
  const { mutate: mutateLogout } = useLogout();

  const RenderToTitle = Title ?? DefaultTitle;

  const drawerWidth = () => {
    if (collapsed) return 80;
    return 250;
  };

  const commonNavLinkStyles: Styles<NavLinkStylesNames, NavLinkStylesParams> = {
    root: {
      display: 'flex',
      color:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[0]
          : theme.colors.gray[7],
      fontWeight: 500,
      '&:hover': {
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[5]
            : theme.colors.gray[0],
      },
      '&[data-active]': {
        '&, &:hover': {
          backgroundColor: theme.fn.variant({
            variant: 'light',
            color: theme.primaryColor,
          }).background,
          color: theme.fn.variant({
            variant: 'light',
            color: theme.primaryColor,
          }).color,
        },
      },
      justifyContent: collapsed && !opened ? 'center' : 'flex-start',
    },
    icon: {
      marginRight: collapsed && !opened ? 0 : 12,
    },
    body: {
      display: collapsed && !opened ? 'none' : 'flex',
    },
  };

  const commonTooltipProps: Partial<TooltipProps> = {
    disabled: !collapsed || opened,
    position: 'right',
    withinPortal: true,
    withArrow: true,
    arrowSize: 8,
    arrowOffset: 12,
    offset: 4,
  };

  const renderTreeView = (tree: ITreeMenu[], selectedKey: string) => {
    return tree.map((item) => {
      const { icon, label, route, name, children } = item;

      const isSelected = route === selectedKey;
      const isParent = children.length > 0;

      const additionalLinkProps = isParent
        ? {}
        : { component: Link, to: route };

      return (
        <CanAccess
          key={route}
          resource={name.toLowerCase()}
          action="list"
          params={{
            resource: item,
          }}
        >
          <Tooltip label={label} {...commonTooltipProps}>
            <NavLink
              key={route}
              label={collapsed && !opened ? null : label}
              icon={icon ?? defaultNavIcon}
              active={isSelected}
              childrenOffset={collapsed && !opened ? 0 : 12}
              defaultOpened={defaultOpenKeys.includes(route || '')}
              styles={commonNavLinkStyles}
              {...additionalLinkProps}
            >
              {isParent && renderTreeView(children, selectedKey)}
            </NavLink>
          </Tooltip>
        </CanAccess>
      );
    });
  };

  const items = renderTreeView(menuItems, selectedKey);

  const dashboard = hasDashboard ? (
    <CanAccess resource="dashboard" action="list">
      <Tooltip
        label={t('dashboard.title', 'Dashboard')}
        {...commonTooltipProps}
      >
        <NavLink
          key="dashboard"
          label={
            collapsed && !opened ? null : t('dashboard.title', 'Dashboard')
          }
          icon={<IconDashboard size={18} />}
          component={Link}
          to="/"
          active={selectedKey === '/'}
          styles={commonNavLinkStyles}
        />
      </Tooltip>
    </CanAccess>
  ) : null;

  const { data: user } = useGetIdentity();

  const logout = isExistAuthentication && (
    <Tooltip label={t('buttons.logout', 'Logout')} {...commonTooltipProps}>
      <NavLink
        key="logout"
        label={collapsed && !opened ? null : t('buttons.logout', 'Logout')}
        icon={<IconLogout size={18} />}
        onClick={() => mutateLogout()}
        styles={commonNavLinkStyles}
      />
    </Tooltip>
  );

  const docs = (
    <NavLink
      key="docs"
      label={collapsed && !opened ? null : t('buttons.docs', 'Docs')}
      icon={<IconBook size={18} />}
      onClick={() => {
        window.open('https://docs.enrolla.io', '_blank');
      }}
      styles={commonNavLinkStyles}
    />
  );

  const renderSider = () => {
    if (render) {
      return render({
        dashboard,
        logout,
        items,
        collapsed,
      });
    }
    return (
      <>
        {dashboard}
        {items}
        {docs}
        {logout}
      </>
    );
  };

  return (
    <>
      <MediaQuery largerThan="md" styles={{ display: 'none' }}>
        <Box sx={{ position: 'fixed', top: 64, left: 0, zIndex: 1199 }}>
          <ActionIcon
            color="white"
            size={36}
            sx={{
              borderRadius: '0 6px 6px 0',
              backgroundColor: theme.fn.variant({
                variant: 'light',
                color: theme.primaryColor,
              }).color,
              color: 'white',
              '&:hover': {
                backgroundColor: theme.fn.variant({
                  variant: 'light',
                  color: theme.primaryColor,
                }).color,
              },
            }}
            onClick={() => setOpened((prev) => !prev)}
          >
            <IconMenu2 />
          </ActionIcon>
        </Box>
      </MediaQuery>

      <MediaQuery largerThan="md" styles={{ display: 'none' }}>
        <Drawer
          opened={opened}
          onClose={() => setOpened(false)}
          size={200}
          zIndex={1200}
          withCloseButton={false}
          styles={{
            drawer: {
              overflow: 'hidden',
            },
          }}
        >
          <Navbar.Section px="xs">
            <RenderToTitle collapsed={false} />
          </Navbar.Section>
          <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
            {renderSider()}
          </Navbar.Section>
        </Drawer>
      </MediaQuery>

      <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
        <Box
          sx={{
            width: drawerWidth(),
            transition: 'width 200ms ease, min-width 200ms ease',
            flexShrink: 0,
          }}
        />
      </MediaQuery>

      <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
        <Navbar
          width={{ base: drawerWidth() }}
          sx={{
            overflow: 'hidden',
            transition: 'width 200ms ease, min-width 200ms ease',
            position: 'fixed',
            top: 0,
            height: '100vh',
            zIndex: 0,
          }}
        >
          <Navbar.Section px="xs">
            <RenderToTitle collapsed={collapsed} />
          </Navbar.Section>
          <Navbar.Section grow mt="sm" component={ScrollArea} mx="-xs" px="xs">
            {renderSider()}
          </Navbar.Section>
          <Navbar.Section>
            <UserButton
              sx={{
                borderTop: `1px solid ${
                  theme.colorScheme === 'dark'
                    ? theme.colors.dark[4]
                    : theme.colors.gray[3]
                }`,
              }}
              image={user?.avatar}
              name={user?.name}
              email={user?.email}
            />
          </Navbar.Section>
        </Navbar>
      </MediaQuery>
    </>
  );
};
