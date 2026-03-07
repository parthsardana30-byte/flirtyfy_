export interface User {
  id: string;
  name: string;
  email: string;
}

export const auth = {
  signup: (name: string, email: string, pass: string) => {
    if (typeof window === 'undefined') return { error: 'Server error' };
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find((u: any) => u.email === email)) {
      return { error: 'User already exists with this email' };
    }
    const newUser = { id: Date.now().toString(), name, email, pass };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    const currentUser = { id: newUser.id, name: newUser.name, email: newUser.email };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    return { user: currentUser };
  },
  
  login: (email: string, pass: string) => {
    if (typeof window === 'undefined') return { error: 'Server error' };
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === email && u.pass === pass);
    if (!user) {
      return { error: 'Invalid email or password' };
    }
    const currentUser = { id: user.id, name: user.name, email: user.email };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    return { user: currentUser };
  },
  
  logout: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('currentUser');
  },
  
  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }
};
