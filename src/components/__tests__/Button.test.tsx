import { describe, it, expect, vi } from 'vitest'
import { customRender, screen } from '@/test/utils'
import Button from '../ui/Button'

describe('Button Component', () => {
  it('should render with children', () => {
    customRender(<Button>Click me</Button>)
    
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('should apply default classes', () => {
    customRender(<Button>Click me</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center')
  })

  it('should apply custom className', () => {
    customRender(<Button className="custom-class">Click me</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  it('should handle click events', async () => {
    const handleClick = vi.fn()
    const { userEvent } = await import('@testing-library/user-event')
    const user = userEvent.setup()
    
    customRender(<Button onClick={handleClick}>Click me</Button>)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    customRender(<Button disabled>Click me</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('should be disabled when isLoading is true', () => {
    customRender(<Button isLoading>Click me</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('should show loading spinner when isLoading is true', () => {
    customRender(<Button isLoading>Click me</Button>)
    
    const spinner = screen.getByRole('button').querySelector('svg')
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveClass('animate-spin')
  })

  it('should not handle clicks when disabled', async () => {
    const handleClick = vi.fn()
    const { userEvent } = await import('@testing-library/user-event')
    const user = userEvent.setup()
    
    customRender(<Button onClick={handleClick} disabled>Click me</Button>)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('should apply different variants correctly', () => {
    customRender(<Button variant="secondary">Secondary</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-muted')
  })

  it('should apply different sizes correctly', () => {
    customRender(<Button size="sm">Small</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('h-10', 'px-4')
  })

  it('should apply fullWidth correctly', () => {
    customRender(<Button fullWidth>Full Width</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('w-full')
  })

  it('should apply danger variant correctly', () => {
    customRender(<Button variant="danger">Delete</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-error')
  })
})
