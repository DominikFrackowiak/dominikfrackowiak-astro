import Dropdown from '@/components/molecules/dropdown'

const applyTheme = (theme: 'dark' | 'light') => {
	document.documentElement.classList.toggle('dark', theme === 'dark')
	localStorage.theme = theme
}

export default function HeaderActions() {
	const toggleTheme = () => {
		const isDark = document.documentElement.classList.contains('dark')
		applyTheme(isDark ? 'light' : 'dark')
	}

	return (
		<div className='flex items-center gap-4'>
			<Dropdown
				trigger='test'
				body={
					<ul className='flex flex-col gap-2'>
						<li>TEST</li>
						<li>TEST 2</li>
					</ul>
				}
			/>
			<button type='button' onClick={toggleTheme} className='text-light'>
				Theme
			</button>
		</div>
	)
}
