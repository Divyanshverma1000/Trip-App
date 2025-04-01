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

export interface ContactInfo {
  label?: string;
  phone?: string;
  email?: string;
}

export interface Concerns {
  womenSafety?: number;
  affordability?: number;
  culturalExperience?: number;
  accessibility?: number;
}

export interface BlogPost {
  _id: string;
  trip?: string;
  host: {
    _id: string;
    name: string;
    email: string;
    photo: string;
  };
  title: string;
  summary?: string;
  description?: string;
  recommendations?: string;
  advisory?: string;
  coverPhoto?: string;
  photos: Photo[];
  contactInfo: ContactInfo[];
  tags: string[];
  budget?: number;
  concerns?: Concerns;
  ratings: Rating[];
  view: number;
  createdAt: string;
  updatedAt: string;
}

export interface Answer {
  answeredBy: {
    _id: string;
    name: string;
    email: string;
    profilePic?: string;
  };
  answerText: string;
  createdAt: string;
}

export interface Question {
  _id: string;
  blog: string;
  askedBy: {
    _id: string;
    name: string;
    email: string;
    profilePic?: string;
  };
  questionText: string;
  answers: Answer[];
  createdAt: string;
}

export interface CreateBlogPostData {
  title: string;
  summary?: string;
  description?: string;
  recommendations?: string;
  advisory?: string;
  blogCoverPhoto?: File | Blob;
  blogPhotos?: Array<{
    file: File | Blob;
    caption?: string;
  }>;
  tags?: string[];
  budget?: number;
  tripId?: string;
  concerns?: Concerns;
}

export const createBlogPost = async (formData: FormData): Promise<BlogPost> => {
  try {
    console.log('Creating blog post with FormData');
    
    const response = await axios.post<BlogPost>('/blogs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    Toast.show({
      type: 'success',
      text1: 'Blog post created successfully'
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Blog creation error:', error.response?.data || error);
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

export const getTrendingBlogs = async (): Promise<BlogPost[]> => {
  try {
    const response = await axios.get<BlogPost[]>('/blogs/trendings');
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
  updates: Partial<CreateBlogPostData>
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
    if (value < 1 || value > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
    const response = await axios.post<BlogPost>(`/blogs/${id}/rate`, { value });
    Toast.show({
      type: 'success',
      text1: 'Rating submitted successfully'
    });
    return response.data;
  } catch (error: any) {
    Toast.show({
      type: 'error',
      text1: 'Failed to submit rating',
      text2: error.message
    });
    throw error;
  }
};

export const updateBlogRating = async (id: string, value: number): Promise<BlogPost> => {
  try {
    if (value < 1 || value > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
    const response = await axios.put<BlogPost>(`/blogs/${id}/rate`, { value });
    Toast.show({
      type: 'success',
      text1: 'Rating updated successfully'
    });
    return response.data;
  } catch (error: any) {
    Toast.show({
      type: 'error',
      text1: 'Failed to update rating',
      text2: error.message
    });
    throw error;
  }
};

export const searchBlogs = async (params: { 
  query?: string; 
  tags?: string[] 
}): Promise<BlogPost[]> => {
  try {
    console.log('Sending search request with params:', params);
    const queryString = new URLSearchParams();
    if (params.query) {
      queryString.append('query', params.query);
    }
    if (params.tags && params.tags.length > 0) {
      queryString.append('tags', params.tags.join(','));
    }
    
    const response = await axios.get<BlogPost[]>(`/blogs/search?${queryString}`);
    console.log('Search response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Search error:', error.response || error);
    Toast.show({
      type: 'error',
      text1: 'Search failed',
      text2: error.response?.data?.message || 'Failed to search blogs'
    });
    throw error;
  }
};

export const askQuestion = async (blogId: string, questionText: string): Promise<Question> => {
  try {
    const response = await axios.post<Question>('/questions/ask', { blogId, questionText });
    Toast.show({
      type: 'success',
      text1: 'Question posted successfully'
    });
    return response.data;
  } catch (error: any) {
    Toast.show({
      type: 'error',
      text1: 'Failed to ask question'
    });
    throw error;
  }
};

export const answerQuestion = async (questionId: string, answerText: string): Promise<Question> => {
  try {
    const response = await axios.post<Question>(`/questions/${questionId}/answer`, { answerText });
    Toast.show({
      type: 'success',
      text1: 'Answer submitted successfully'
    });
    return response.data;
  } catch (error: any) {
    Toast.show({
      type: 'error',
      text1: 'Failed to submit answer'
    });
    throw error;
  }
};

export const getQuestions = async (blogId: string): Promise<Question[]> => {
  try {
    const response = await axios.get<Question[]>(`/questions/blog/${blogId}`);
    return response.data;
  } catch (error: any) {
    Toast.show({
      type: 'error',
      text1: 'Failed to fetch questions'
    });
    throw error;
  }
};
