import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import ArticlePage from './pages/ArticlePage'
import MovieIntelligence from './pages/MovieIntelligence'
import PodcastPage from './pages/PodcastPage'
import Preferences from './pages/Preferences'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/article/:slug" element={<ArticlePage />} />
        <Route path="/movies" element={<MovieIntelligence />} />
        <Route path="/podcast" element={<PodcastPage />} />
        <Route path="/preferences" element={<Preferences />} />
      </Route>
    </Routes>
  )
}
