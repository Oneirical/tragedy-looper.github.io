<script lang="ts" module>
  type linkParameters = {
    tragedySet: TragedySetName;
    cast: readonly CharacterName[];
    incidents: readonly ScriptIncidentPlayer[];
    specialRules: readonly string[];
  };
  export function linkPlayerAid(params: linkParameters): string {
    return generateUrl(`${base}/player/`, params);
  }
</script>

<script lang="ts">
  import { onMount } from 'svelte';
  import type { ScriptIncidentPlayer } from '../../model/script';
  import Table from '../../view/table.svelte';
  import type { CharacterName } from '../../model/characters';
  import type { TragedySetName } from '../../model/tragedySets';
  import './page.css';
  import './dialog.css';
  import { getString, languageOverride, navigationLanguage } from '../(site)/+layout.svelte';
  import { getDeployedLanguage } from '../../translations';
  import Translation from '../../view/translation.svelte';
  import { base } from '$app/paths';
  import { generateUrl, getParams } from '../../zipQueryHelper';

  let searchParams: URLSearchParams | undefined;

  onMount(() => {
    navigationLanguage.set(navigator.language?.split('-')[0] ?? 'en');

    searchParams = new URLSearchParams(document.location.search);
    const pushState = history.pushState;
    history.pushState = function (data: any, unused: string, url?: string | URL | null) {
      pushState.apply(history, [data, unused, url]);
      searchParams = new URLSearchParams(document.location.search);
    };
  });

  $: parameters = (searchParams ? getParams(searchParams) : {}) as Partial<linkParameters>;
  $: tragedySet = parameters.tragedySet;
  $: cast = parameters.cast;
  $: incidents = parameters.incidents;
  $: specialRules = parameters.specialRules;
  $: tablet = searchParams?.has('tablet');
  $: touchTarget = searchParams?.has('touchTarget');

  let reversedTablet: URLSearchParams | undefined;
  let reversedTouchTarget: URLSearchParams | undefined;

  $: {
    if (searchParams) {
      reversedTablet = new URLSearchParams(searchParams);
      if (searchParams.has('tablet')) {
        reversedTablet.delete('tablet');
      } else {
        reversedTablet.append('tablet', '');
      }
      reversedTouchTarget = new URLSearchParams(searchParams);
      if (searchParams.has('touchTarget')) {
        reversedTouchTarget.delete('touchTarget');
      } else {
        reversedTouchTarget.append('touchTarget', '');
      }
    }
  }
</script>

{#if tragedySet && cast && incidents && specialRules}
  <nav class="hide-on-print">
    <ul>
      <li>
        <a href="?{reversedTablet?.toString()}" data-sveltekit-reload>
          {#if tablet}<Translation translationKey={'Print View'} />{:else}<Translation
              translationKey={'Tablet View'}
            />{/if}</a
        >
      </li>
      {#if tablet}
        <li>
          <a href="?{reversedTouchTarget?.toString()}" data-sveltekit-reload>
            {#if touchTarget}<Translation translationKey={'Compakt View'} />{:else}{$getString(
                'Touch optimized View'
              )}{/if}</a
          >
        </li>
      {/if}
      <li>
        <input
          list="languageOptions"
          bind:value={$languageOverride}
          placeholder="Language Override"
        />
        <datalist id="languageOptions">
          {#each getDeployedLanguage() as lang}
            <option value={lang}>{lang}</option>
          {/each}
        </datalist>
      </li>
    </ul>
  </nav>
  <Table
    {tragedySet}
    {cast}
    {incidents}
    {specialRules}
    {tablet}
    touchTarget={touchTarget && tablet}
  />
{:else}
  <div
    style="display: grid; justify-items: center; align-items: center; grid-template-rows: auto 1fr; height: 100vh;"
  >
    <h1><Translation translationKey={'Tragedy Looper Deduction overview'} /></h1>

    <p
      aria-busy="true"
      style="font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif; font-size: xx-large;"
    >
      <Translation translationKey={'Rendering'} />
    </p>
  </div>
{/if}

<style lang="scss">
  * {
    box-sizing: border-box;
  }
  nav {
    top: 0px;
    position: sticky;
    z-index: 998;
    width: fit-content;
    background-color: var(--background);
    border-right: 1px solid lightgray;
    border-bottom: 1px solid lightgray;
    padding: 1em;
    border-bottom-right-radius: var(--border-radius);

    --pico-primary: hsl(195, 85%, 41%);
    --pico-primary-hover: hsl(195, 90%, 32%);
    --pico-primary-focus: rgba(16, 149, 193, 0.125);
    --pico-primary-inverse: #fff;

    --font-family:
      system-ui, -apple-system, 'Segoe UI', 'Roboto', 'Ubuntu', 'Cantarell', 'Noto Sans',
      sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    --line-height: 1.5;
    --font-weight: 400;
    --font-size: 16px;
    --border-radius: 0.25rem;
    --border-width: 1px;
    --outline-width: 3px;
    --spacing: 1rem;
    --typography-spacing-vertical: 1.5rem;
    --block-spacing-vertical: calc(var(--spacing) * 2);
    --block-spacing-horizontal: var(--spacing);
    --grid-spacing-vertical: 0;
    --grid-spacing-horizontal: var(--spacing);
    --form-element-spacing-vertical: 0.75rem;
    --form-element-spacing-horizontal: 1rem;
    --nav-element-spacing-vertical: 1rem;
    --nav-element-spacing-horizontal: 0.5rem;
    --nav-link-spacing-vertical: 0.5rem;
    --nav-link-spacing-horizontal: 0.5rem;
    --form-label-font-weight: var(--font-weight);
    --transition: 0.2s ease-in-out;
    --modal-overlay-backdrop-filter: blur(0.25rem);

    ul {
      list-style: none;
      padding: 0px;
      display: grid;
      grid-auto-flow: column;
      gap: var(--form-element-spacing-vertical);
      li {
        background-color: lightblue;
        display: contents;
        a {
          border-radius: 1em;
          border: 1px solid red;
          padding: 0.4em;

          --background-color: var(--pico-primary);
          --border-color: var(--pico-primary);
          --color: var(--pico-primary-inverse);
          --box-shadow: var(--button-box-shadow, 0 0 0 rgba(0, 0, 0, 0));
          padding: var(--form-element-spacing-vertical) var(--form-element-spacing-horizontal);
          border: var(--border-width) solid var(--border-color);
          border-radius: var(--border-radius);
          outline: none;
          background-color: var(--background-color);
          box-shadow: var(--box-shadow);
          color: var(--color);
          font-weight: var(--font-weight);
          font-size: 1rem;
          line-height: var(--line-height);
          text-align: center;
          cursor: pointer;
          transition:
            background-color var(--transition),
            border-color var(--transition),
            color var(--transition),
            box-shadow var(--transition);

          &:is([aria-current], :hover, :active, :focus) {
            --background-color: var(--pico-primary-hover);
            --border-color: var(--pico-primary-hover);
            --box-shadow: var(--button-hover-box-shadow, 0 0 0 rgba(0, 0, 0, 0));
            --color: var(--pico-primary-inverse);
          }
          &:focus {
            --box-shadow:
              var(--button-hover-box-shadow, 0 0 0 rgba(0, 0, 0, 0)),
              0 0 0 var(--outline-width) var(--pico-primary-focus);
          }
        }
      }
    }
  }
</style>
