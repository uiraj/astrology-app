import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';

// Wraps a component with NavigationContainer for screens that use navigation hooks.
// For screens that use useAuth, mock useAuth directly in the test instead.
function NavigationWrapper({ children }: { children: React.ReactNode }) {
  return <NavigationContainer>{children}</NavigationContainer>;
}

export function renderWithNavigation(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: NavigationWrapper, ...options });
}

// Minimal mock navigation prop for screens that receive navigation as a prop
export function createMockNavigation() {
  return {
    navigate: jest.fn(),
    goBack: jest.fn(),
    replace: jest.fn(),
    reset: jest.fn(),
    dispatch: jest.fn(),
  };
}

// Minimal mock route prop
export const mockRoute = { key: 'test', name: 'Test', params: undefined };
