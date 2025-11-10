'use client'

import * as React from 'react'
import { ChevronsUpDown } from 'lucide-react'
import { cn } from '@/utilities/ui'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Category = {
  id: string
  title: string
}

interface CategorySelectProps {
  categories: Category[]
  selectedCategories: string[]
  onCategoriesChange: (categories: string[]) => void
}

export function CategorySelect({
  categories,
  selectedCategories,
  onCategoriesChange,
}: CategorySelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  const filteredCategories = categories.filter((category) =>
    category.title.toLowerCase().includes(search.toLowerCase()),
  )

  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      onCategoriesChange(selectedCategories.filter((id) => id !== categoryId))
    } else {
      onCategoriesChange([...selectedCategories, categoryId])
    }
  }

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  if (categories.length === 0) {
    return (
      <div>
        <Label>Categories</Label>
        <p className="text-sm text-muted-foreground italic mt-2">
          No categories available. Create categories in the{' '}
          <a
            href="/admin/collections/categories"
            target="_blank"
            className="text-blue-600 underline hover:text-blue-800"
          >
            admin panel
          </a>
          .
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2" ref={dropdownRef}>
      <Label>Categories</Label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-4 py-2 border border-border rounded-md bg-background hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
        >
          <span className="text-sm">
            {selectedCategories.length > 0
              ? `${selectedCategories.length} selected`
              : 'Select categories...'}
          </span>
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </button>

        {open && (
          <div className="absolute z-50 w-full mt-2 bg-card border border-border rounded-md shadow-lg">
            {/* Search input */}
            <div className="p-2 border-b border-border">
              <Input
                type="text"
                placeholder="Search categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8"
              />
            </div>

            <div className="max-h-60 overflow-y-auto p-2">
              {filteredCategories.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No categories found.
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredCategories.map((category) => {
                    const isSelected = selectedCategories.includes(category.id)
                    return (
                      <div
                        key={category.id}
                        className={cn(
                          'flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent transition-colors',
                          isSelected && 'bg-accent',
                        )}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleCategory(category.id)}
                        />
                        <label
                          className="text-sm cursor-pointer flex-1"
                          onClick={() => toggleCategory(category.id)}
                        >
                          {category.title}
                        </label>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

