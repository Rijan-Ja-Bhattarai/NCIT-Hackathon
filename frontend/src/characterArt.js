// Fallback artwork keyed by character id — mirrors characters.py when the API
// is unavailable. Prefer image/avatar/tagline from /api/characters at runtime.

export const CHARACTER_ART = {
  miku: {
    tagline: 'Gentle encouragement and a soft place to land.',
    image: 'https://preview.redd.it/hatsune-miku-by-yutttang-v0-y7yogy2y12vg1.jpeg?width=640&crop=smart&auto=webp&s=2fbc92642837bca9682430974bbb3e893a1a9953',
    avatar: 'https://i.pinimg.com/736x/e7/27/89/e727894df2d327f2605cc8797fc8f4a1.jpg',
  },
  gojo: {
    tagline: 'Confident, playful, makes hard things feel lighter.',
    image: 'https://i.redd.it/ftzkqrqcu4df1.jpeg',
    avatar: 'https://i.pinimg.com/736x/8c/9b/07/8c9b07e5f25b7776190bf9de4da60c47.jpg',
  },
  jennier_lopez: {
    tagline: 'Warm, empathetic, and encouraging.',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=640&q=80',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
  },
  luffy: {
    tagline: 'Loud, loyal, refuses to let you give up.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJE6xOQuW032-JgEo19_d1g2EhaPuKteOS3wUZNfAOp7ZEX5ZjBYCNa_U&s=10',
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSWeuYnbXbNnULzNUt5k2x91FXIUsEO7IAG0uCaOX5-GlmiDpQsHGacE8&s=10',
  },
}
