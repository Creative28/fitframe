import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('App error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center gap-6 px-6 text-center">
          <div className="text-6xl">😕</div>
          <div>
            <h2 className="font-playfair text-2xl font-bold text-[#1A1A2E] mb-2">Something went wrong</h2>
            <p className="text-gray-500 font-dm text-sm">An unexpected error occurred. Please refresh and try again.</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#1A1A2E] text-white rounded-full font-dm font-semibold text-sm hover:bg-[#2a2a4e] transition-colors"
          >
            Refresh page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}