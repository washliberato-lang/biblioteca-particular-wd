import { createClient } from '@supabase/supabase-js'
import { Book } from '../types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Using local storage mode.')
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Database operations
export const booksService = {
  // Get all books from Supabase
  async getAll(): Promise<Book[]> {
    if (!supabase) return []
    
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error loading books:', error)
      return []
    }
    
    return (data || []).map(row => ({
      ...row.data,
      id: row.id.toString()
    }))
  },

  // Add a new book
  async add(book: Book): Promise<boolean> {
    if (!supabase) return false
    
    const { error } = await supabase
      .from('books')
      .insert([{ data: book }])
    
    if (error) {
      console.error('Error adding book:', error)
      return false
    }
    
    return true
  },

  // Import multiple books
  async importBooks(books: Book[]): Promise<boolean> {
    if (!supabase) return false
    
    const records = books.map(book => ({ data: book }))
    
    const { error } = await supabase
      .from('books')
      .insert(records)
    
    if (error) {
      console.error('Error importing books:', error)
      return false
    }
    
    return true
  },

  // Delete a book
  async delete(id: string): Promise<boolean> {
    if (!supabase) return false
    
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting book:', error)
      return false
    }
    
    return true
  },

  // Update a book
  async update(id: string, bookData: Book): Promise<boolean> {
    if (!supabase) return false
    
    const { error } = await supabase
      .from('books')
      .update({ data: bookData })
      .eq('id', id)
    
    if (error) {
      console.error('Error updating book:', error)
      return false
    }
    
    return true
  }
}
