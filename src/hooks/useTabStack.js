import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const TAB_ROOTS = ['/studio', '/my-photos', '/tryon-links', '/account'];
const STORAGE_KEY = 'fitframe_tab_stacks';
const MAX_DEPTH = 20;

function readStacks() {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function writeStacks(stacks) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stacks));
  } catch {}
}

export function getTabForPath(pathname) {
  for (const root of TAB_ROOTS) {
    if (pathname === root || pathname.startsWith(root + '/')) return root;
  }
  if (pathname.startsWith('/result') || pathname.startsWith('/bulk-studio')) return '/studio';
  if (pathname.startsWith('/catalog')) return '/my-photos';
  return null;
}

export function useTabStack() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = getTabForPath(location.pathname);

  // Persist current path on the active tab's stack
  useEffect(() => {
    if (!activeTab) return;
    const stacks = readStacks();
    const stack = stacks[activeTab] || [];
    if (stack[stack.length - 1] !== location.pathname) {
      stack.push(location.pathname);
      if (stack.length > MAX_DEPTH) stack.shift();
      stacks[activeTab] = stack;
      writeStacks(stacks);
    }
  }, [location.pathname, activeTab]);

  const switchToTab = (tabPath) => {
    const stacks = readStacks();
    const stack = stacks[tabPath] || [];
    const target = stack.length > 0 ? stack[stack.length - 1] : tabPath;
    navigate(target);
  };

  const resetTab = (tabPath) => {
    const stacks = readStacks();
    stacks[tabPath] = [tabPath];
    writeStacks(stacks);
    navigate(tabPath);
  };

  return { activeTab, switchToTab, resetTab };
}