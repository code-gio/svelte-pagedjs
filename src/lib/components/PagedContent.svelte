<script lang="ts">
	import { StyleGenerator } from '$lib/StyleGenerator.js';
	import { PageOrientation, PageSize, type PageBreak, type PagedOptions } from '$lib/types.js';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	interface Props {
		options?: PagedOptions;
		children?: () => any;
		editable?: boolean;
		autoScale?: boolean;
		onRenderComplete?: (pageCount: number, renderTime: number) => void;
		stylesheets?: string[]; // Array of stylesheet URLs
	}

	let {
		options = {
			pageSize: PageSize.A4,
			orientation: PageOrientation.Portrait,
			margins: {
				general: '1cm'
			}
		},
		children,
		editable = false,
		autoScale = true,
		onRenderComplete = undefined,
		stylesheets = []
	}: Props = $props();

	let container: HTMLElement;
	let contentContainer: HTMLElement;
	let previewer: any;
	let renderStartTime: number;

	function injectGlobalStyles(styles: string) {
		const styleTag = document.createElement('style');
		styleTag.textContent = styles;
		document.head.appendChild(styleTag);
	}

	function handleResize() {
		if (!autoScale || !browser) return;

		const pages = container?.querySelector('.pagedjs_pages') as HTMLElement;
		if (pages) {
			const scale = (window.innerWidth * 0.9) / pages.offsetWidth;
			if (scale < 1) {
				pages.style.transform = `scale(${scale}) translate(${window.innerWidth / 2 - (pages.offsetWidth * scale) / 2}px, 0)`;
			} else {
				pages.style.transform = 'none';
			}
		}
	}

	function makeContentEditable() {
		if (!editable) return;

		const editableAreas = container.querySelectorAll('.pagedjs_page .pagedjs_area > div');
		editableAreas.forEach((area) => {
			(area as HTMLElement).setAttribute('contenteditable', 'true');
		});
	}

	onMount(async () => {
		if (!browser) return;

		try {
			// @ts-ignore
			const { Previewer } = await import('pagedjs');
			previewer = new Previewer();

			if (autoScale) {
				window.addEventListener('resize', handleResize);
				previewer.on('rendering', handleResize);
			}

			const tempContainer = document.createElement('div');
			tempContainer.innerHTML = contentContainer.innerHTML;
			container.innerHTML = '';

			renderStartTime = performance.now();

			const generatedStyles = StyleGenerator.generateCSS(options);
			injectGlobalStyles(generatedStyles);

			const allStylesheets = [...stylesheets];

			const flow = await previewer.preview(tempContainer.innerHTML, allStylesheets, container);

			const renderTime = performance.now() - renderStartTime;
			onRenderComplete?.(flow.total, renderTime);

			makeContentEditable();
			handleResize();
		} catch (error) {
			console.error('PagedJS Error:', error);
		}
	});

	onDestroy(() => {
		if (!browser) return;

		if (previewer) {
			previewer.destroy();
		}
		if (autoScale) {
			window.removeEventListener('resize', handleResize);
		}
	});

	export function addPageBreak(element: HTMLElement, break_: PageBreak) {
		if (break_.before) {
			element.classList.add(`page-break-before-${break_.before}`);
		}
		if (break_.after) {
			element.classList.add(`page-break-after-${break_.after}`);
		}
	}
</script>

<div bind:this={container} class="paged-content">
	<div bind:this={contentContainer} style="display: none;">
		{@render children?.()}
	</div>
</div>

<style>
	:global(.pagedjs_page) {
		background-color: white;
		box-shadow:
			0 4px 6px rgba(0, 0, 0, 0.1),
			0 1px 3px rgba(0, 0, 0, 0.06); /* More realistic shadow */
		margin: 1cm auto; /* Adds spacing between the pages */

		border: 1px solid #ddd; /* Thin border for a slight paper edge feel */
	}

	/* Optional: Add a subtle texture to the paper */
	:global(.pagedjs_page)::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: url('https://www.transparenttextures.com/patterns/white-paperboard.png');
		opacity: 0.05; /* Subtle texture effect */
		z-index: -1;
	}
</style>
