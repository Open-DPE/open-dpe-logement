export function renderRepartitionDeperditions(props: {
	gv: number;
	dp_murs: number;
	dp_planchers_bas: number;
	dp_planchers_hauts: number;
	dp_ponts_thermiques: number;
	dp_menuiseries: number;
	dr: number;
}): string {
	const murs = (props.dp_murs / props.gv) * 100;
	const planchers_bas = (props.dp_planchers_bas / props.gv) * 100;
	const planchers_hauts = (props.dp_planchers_hauts / props.gv) * 100;
	const ponts_thermiques = (props.dp_ponts_thermiques / props.gv) * 100;
	const menuiserie = (props.dp_menuiseries / props.gv) * 100;
	const dr = (props.dr / props.gv) * 100;

	return `
    <svg
      width='380'
      height='240'
      viewBox='0 0 380 240'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path d='M132.164 89.2268V100.946H141.256V92.9464L162.627 71.5221L160.801 69.6823L157.268 66.1627L156.161 65.0828L132.164 89.2268ZM193.49 27.9003L162.627 58.6569L169.053 65.0828L193.384 40.7655L245.565 92.9464V156.793H141.189V140.888H132.164V165.885H254.724V89.2268L193.49 27.9003Z' fill='#DEDEDE'></path>
      <path d='M138.79 100.905H134.737V140.874H138.79V100.905Z' fill='#5BC5F2'></path>
      <path d='M200.836 148.22H189.491V181.43H183.851L195.157 201.001L206.462 181.43H200.836V148.22Z' fill='#E94B39'></path>
      <path d='M287.56 122.543L267.976 111.238V116.864H234.766V128.209H267.976V133.848L287.56 122.543Z' fill='#E94B39'></path>
      <path d='M125.084 128.209H158.294V116.864H125.084V111.238L105.5 122.53L125.084 133.848V128.209Z' fill='#E94B39'></path>
      <path d='M148.855 143.754L121.325 171.298L117.339 167.312L111.486 189.149L133.324 183.296L129.337 179.31L156.881 151.78L148.855 143.754Z' fill='#E94B39'></path>
      <path d='M241.965 58.0567L247.804 36.2191L225.967 42.0585L229.953 46.0447L206.462 69.5354L214.488 77.5479L237.965 54.0705L241.965 58.0567Z' fill='#E94B39'></path>
      <path d='M187.198 77.8412C186.07 76.6791 185.214 75.2812 184.691 73.7483C182.865 69.6287 180.372 63.9894 170.026 61.7496C163.48 60.3364 163.014 59.0833 161.867 55.9103C160.885 52.7521 159.214 49.8514 156.974 47.4179L155.641 46.018L159.641 42.0185L137.763 36.2191L143.616 58.0567L147.615 54.0571L148.762 55.257C149.915 56.5661 150.754 58.1209 151.215 59.8032C153.268 65.4425 155.921 70.3087 167.627 72.8551C172.319 73.8683 172.959 75.1881 174.292 78.3611C175.435 81.3466 177.224 84.0421 179.532 86.2536C180.412 87.0402 182.852 89.3999 183.731 90.2531L191.611 82.1074C191.477 81.974 188.344 78.9344 187.158 77.8545' fill='#E94B39'></path>

      <text y='20' fill='#1A1A1A' font-size='14'>
        <tspan x='100' text-anchor='middle'>Ventilation</tspan>
        <tspan
          x='100'
          dy='1.2em'
          text-anchor='middle'
          font-weight='600'
          className='color-primary'
        >${dr.toLocaleString()} %</tspan>
      </text>
      <text y='20' fill='#1A1A1A' font-size='14'>
        <tspan x='280' text-anchor='middle'>Toitures</tspan>
        <tspan
          x='280'
          dy='1.2em'
          text-anchor='middle'
          font-weight='600'
          className='color-primary'
        >${planchers_hauts.toLocaleString()} %</tspan>
      </text>
      <text
        id='murs'
        y='120'
        fill='#1A1A1A'
        font-family='Gotham'
        font-size='14'
      >
        <tspan x='320' text-anchor='middle'>Murs</tspan>
        <tspan
          x='320'
          dy='1.2em'
          text-anchor='middle'
          font-weight='600'
          className='color-primary'
        >${murs.toLocaleString()} %</tspan>
      </text>
      <text y='220' fill='#1A1A1A' font-size='14'>
        <tspan x='198' text-anchor='middle'>Planchers</tspan>
        <tspan
          x='198'
          dy='1.2em'
          text-anchor='middle'
          font-weight='600'
          className='color-primary'
        >${planchers_bas.toLocaleString()} %</tspan>
      </text>
      <text y='210' fill='#1A1A1A' font-size='14'>
        <tspan x='90' text-anchor='middle'>Ponts thermiques</tspan>
        <tspan
          x='90'
          dy='1.2em'
          text-anchor='middle'
          font-weight='600'
          className='color-primary'
        >${ponts_thermiques.toLocaleString()} %</tspan>
      </text>
      <text y='120' fill='#1A1A1A' font-size='14'>
        <tspan x='60' text-anchor='middle'>Menuiseries</tspan>
        <tspan
          x='60'
          dy='1.2em'
          text-anchor='middle'
          font-weight='600'
          className='color-primary'
        >${menuiserie.toLocaleString()} %</tspan>
      </text>
    </svg>
  `;
}
