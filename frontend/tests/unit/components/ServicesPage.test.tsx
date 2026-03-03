import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ServicesPage } from '@/components/services/ServicesPage';

// Mock API
vi.mock('@/services/api', () => ({
  api: {
    getServices: vi.fn().mockResolvedValue([
      {
        _id: '1',
        name: 'Test Service',
        slug: 'test-service',
        shortDescription: 'Test description',
        fullDescription: 'Full description',
        startingPrice: 1000,
        category: 'Test',
        isActive: true,
      },
    ]),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('ServicesPage', () => {
  it('should render services list', async () => {
    render(<ServicesPage />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByText('Наші послуги')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Test Service')).toBeInTheDocument();
  });

  it('should filter services by category', async () => {
    render(<ServicesPage />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByText('Всі')).toBeInTheDocument();
    });
    
    const allButton = screen.getByRole('button', { name: 'Всі' });
    expect(allButton).toBeInTheDocument();
  });
});
