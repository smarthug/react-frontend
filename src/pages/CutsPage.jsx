import { useState } from 'react'
import CutCard from '../components/CutCard'

const initialCuts = [
  { id: '1', src: 'https://picsum.photos/seed/cut1/400/300', path: 'apple-toolkit/datasets/childrens_drawings/childhood-baby-anime-pictures/42876.jpg', description: 'a bear, a pig with a green balloon, an owl wearing suspenders, a donkey, and a bunny man with a red shirt, standing on grass' },
  { id: '2', src: 'https://picsum.photos/seed/cut2/400/300', path: 'apple-toolkit/datasets/childrens_drawings/childhood-childrens-drawings-houses-childs-drawing/38648.jpg', description: 'a family standing in front of 2 houses, the dad has on a navy shirt, the mom has a purple dress, and the daughter had a pink dress.' },
  { id: '3', src: 'https://picsum.photos/seed/cut3/400/300', path: 'apple-toolkit/datasets/childrens_drawings/childhood-childrens-drawings-people-baby-drawing/42778.jpg', description: 'a tree and a family of three, a young boy wearing a green shirt, a woman wearing a red shirt, and a man wearing a brown shirt' },
  { id: '4', src: 'https://picsum.photos/seed/cut4/400/300', path: 'apple-toolkit/datasets/childrens_drawings/childhood-childrens-drawings-people-children-drawing/43876.jpg', description: '6 people, a family, 3 men with brown clothing, a woman with a blue dress, a woman with a purple dress, and a woman with a pink dress.' },
  { id: '5', src: 'https://picsum.photos/seed/cut5/400/300', path: 'apple-toolkit/datasets/childrens_drawings/childhood-childrens-drawings-people-childi-drawing/43788.jpg', description: 'an ocean scene. There is a dolphin jumping out of the water and a bunch of ships in the background chasing a smaller ship up front.' },
  { id: '6', src: 'https://picsum.photos/seed/cut6/400/300', path: 'apple-toolkit/datasets/childrens_drawings/childhood-childrens-drawings-people-family-treasure/16779.jpg', description: 'a family of 3, a man wearing a black shirt and khakis that is holding a metal detector, a child is in the middle with a green shirt on' },
  { id: '7', src: 'https://picsum.photos/seed/cut7/400/300', path: 'apple-toolkit/datasets/childrens_drawings/childhood-childrens-drawings-people-formula-1/18706.jpg', description: 'A bunch of people tied to a big red wall, a red person is in the front' },
  { id: '8', src: 'https://picsum.photos/seed/cut8/400/300', path: 'apple-toolkit/datasets/childrens_drawings/childhood-childrens-drawings-people-snowy-winter/17281.jpg', description: 'a father and son building a snowman in the snow, the father has on a black shirt and the child had on a green shirt and a red hat with earmuffs' },
]

function CutsPage() {
  const [cuts, setCuts] = useState(initialCuts)

  const handleDelete = (id) => {
    setCuts((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div className="cuts-grid">
      {cuts.map((cut) => (
        <CutCard key={cut.id} cut={cut} onDelete={handleDelete} />
      ))}
    </div>
  )
}

export default CutsPage
