// Transportation icons as simple SVG data URLs
export const transportationIcons = {
  metro: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%230ea5e9' d='M12 2c-4.42 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20v1h2l2-2h4l2 2h2v-1l-1.5-1c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-3.58-4-8-4z'/%3E%3C/svg%3E",
    name: "Metro"
  },
  taxi: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23f59e0b' d='M18.92 6.01C18.72 5.42 18.16 5 17.5 5H15V3H9v2H6.5c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z'/%3E%3C/svg%3E",
    name: "Taxi"
  },
  bus: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%2310b981' d='M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10z'/%3E%3C/svg%3E",
    name: "Bus"
  },
  train: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%238b5cf6' d='M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h2l2-2h4l2 2h2v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4z'/%3E%3C/svg%3E",
    name: "Train"
  },
  walking: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%236b7280' d='M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7'/%3E%3C/svg%3E",
    name: "Walking"
  },
  car: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23ef4444' d='M18.92 6.01C18.72 5.42 18.16 5 17.5 5H15V3H9v2H6.5c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z'/%3E%3C/svg%3E",
    name: "Car"
  }
};

export function getTransportationIcon(type: string) {
  const normalizedType = type.toLowerCase();
  
  if (normalizedType.includes('metro') || normalizedType.includes('subway')) {
    return transportationIcons.metro;
  } else if (normalizedType.includes('taxi') || normalizedType.includes('cab')) {
    return transportationIcons.taxi;
  } else if (normalizedType.includes('bus')) {
    return transportationIcons.bus;
  } else if (normalizedType.includes('train')) {
    return transportationIcons.train;
  } else if (normalizedType.includes('walk') || normalizedType.includes('foot')) {
    return transportationIcons.walking;
  } else if (normalizedType.includes('car') || normalizedType.includes('drive')) {
    return transportationIcons.car;
  }
  
  // Default to metro if no match
  return transportationIcons.metro;
} 