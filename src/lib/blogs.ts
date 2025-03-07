import axios from './axios';
import Toast from 'react-native-toast-message';

export interface Photo {
  url: string;
  caption?: string;
}

export interface Rating {
  user: {
    _id: string;
    name: string;
    email: string;
  };
  value: number;
}

export interface BlogPost {
  _id: string;
  trip: string;
  host: {
    _id: string;
    name: string;
    email: string;
  };
  caption?: string;
  photos: Photo[];
  content?: string;
  ratings: Rating[];
  createdAt: string;
  updatedAt: string;
}

export const createBlogPost = async (
  tripId: string,
  // caption: string,
  // photos: Array<{ url: string; caption?: string }>,
  // content: string
): Promise<BlogPost> => {
  try {
    const response = await axios.post<BlogPost>('/blogs', {
      tripId,
      // caption,
      // photos,
      
    });
    Toast.show({
      type: 'success',
      text1: 'Blog post created successfully'
    });
    return response.data;
  } catch (error: any) {
    console.error('Blog creation error:', error);
    Toast.show({
      type: 'error',
      text1: 'Failed to create blog post',
      text2: error.response?.data?.message || error.message
    });
    throw error;
  }
};

export const getBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const response = await axios.get<BlogPost[]>('/blogs');
    return response.data;
  } catch (error: any) {
    Toast.show({
      type: 'error',
      text1: 'Failed to fetch blog posts'
    });
    throw error;
  }
};

export const getBlogPostById = async (id: string): Promise<BlogPost> => {
  try {
    const response = await axios.get<BlogPost>(`/blogs/${id}`);
    return response.data;
  } catch (error: any) {
    Toast.show({
      type: 'error',
      text1: 'Failed to fetch blog post'
    });
    throw error;
  }
};

export const updateBlogPost = async (
  id: string,
  updates: {
    caption?: string;
    photos?: Photo[];
    content?: string;
  }
): Promise<BlogPost> => {
  try {
    const response = await axios.put<BlogPost>(`/blogs/${id}`, updates);
    Toast.show({
      type: 'success',
      text1: 'Blog post updated successfully'
    });
    return response.data;
  } catch (error: any) {
    Toast.show({
      type: 'error',
      text1: 'Failed to update blog post'
    });
    throw error;
  }
};

export const deleteBlogPost = async (id: string): Promise<void> => {
  try {
    await axios.delete(`/blogs/${id}`);
    Toast.show({
      type: 'success',
      text1: 'Blog post deleted successfully'
    });
  } catch (error: any) {
    Toast.show({
      type: 'error',
      text1: 'Failed to delete blog post'
    });
    throw error;
  }
};

export const rateBlogPost = async (id: string, value: number): Promise<BlogPost> => {
  try {
    const response = await axios.post<BlogPost>(`/blogs/${id}/rate`, { value });
    Toast.show({
      type: 'success',
      text1: 'Rating submitted successfully'
    });
    return response.data;
  } catch (error: any) {
    Toast.show({
      type: 'error',
      text1: 'Failed to submit rating'
    });
    throw error;
  }
};

export const updateBlogRating = async (id: string, value: number): Promise<BlogPost> => {
  try {
    const response = await axios.put<BlogPost>(`/blogs/${id}/rate`, { value });
    Toast.show({
      type: 'success',
      text1: 'Rating updated successfully'
    });
    return response.data;
  } catch (error: any) {
    Toast.show({
      type: 'error',
      text1: 'Failed to update rating'
    });
    throw error;
  }
};

export const searchBlogs = async (params: { query?: string; tags?: string[] }): Promise<BlogPost[]> => {
  try {
    const queryString = new URLSearchParams();
    if (params.query) {
      queryString.append('query', params.query);
    }
    if (params.tags && params.tags.length > 0) {
      queryString.append('tags', params.tags.join(','));
    }
    
    const response = await axios.get<BlogPost[]>(`/blogs/search?${queryString}`);
    return response.data;
  } catch (error: any) {
    Toast.show({
      type: 'error',
      text1: 'Failed to search blogs'
    });
    throw error;
  }
};
