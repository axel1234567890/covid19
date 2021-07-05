import React, {useContext} from 'react'
import PropTypes from 'prop-types'

import colors from '../../../styles/colors'

import {AppContext} from '../../../pages'

import Counter from '../../counter'
import PieChartPercent from '../../pie-chart-percent'

import {VaccinsContext} from '.'
import indicateurs from './indicateurs'

const VaccinsCounters = props => {
  const {isMobileDevice} = useContext(AppContext)
  const {selectedStat, setSelectedStat} = useContext(VaccinsContext)

  const {report} = props
  const previousReport = props.previousReport || {}

  const stocksCountersList = [
    'stockNombreTotalDoses',
    'stockNombreDosesPfizer',
    'stockNombreDosesModerna'
  ].map(i => indicateurs.find(indicateur => indicateur.name === i))

  const stocksEhpadCountersList = [
    'stockEhpadNombreDosesPfizer'
  ].map(i => indicateurs.find(indicateur => indicateur.name === i))

  const livraisonsCountersList = [
    'livraisonsCumulNombreTotalDoses',
    'livraisonsCumulNombreDosesPfizer',
    'livraisonsCumulNombreDosesModerna'
  ].map(i => indicateurs.find(indicateur => indicateur.name === i))

  const handleClick = chartName => {
    setSelectedStat(chartName)
  }

  return (
    <div className='stats'>
      <div className='title'>Stocks pour les établissements de santé</div>
      <div className='counters'>
        {stocksCountersList.map(counter => (
          <Counter
            key={counter.name}
            isSelected={selectedStat === counter.name}
            onClick={() => handleClick(counter.name)}
            value={report[counter.name]}
            previousValue={previousReport[counter.name]}
            label={counter.label}
            details={counter.details}
            color={counter.color}
          />
        ))}
      </div>

      {report && report.stockNombreDosesPfizer && report.stockNombreDosesModerna && (
        <PieChartPercent
          data={[report.stockNombreDosesPfizer, report.stockNombreDosesModerna]}
          labels={['Stock doses Pfizer modifié', 'Stock doses Moderna modifié']}
          colors={[colors.darkBlue, colors.darkRed]}
          height={isMobileDevice ? 150 : 130}
        />
      )}

      <div className='title'>Stocks pour les EHPAD modifié</div>
      <div className='counters'>
        {stocksEhpadCountersList.map(counter => (
          <Counter
            key={counter.name}
            isSelected={selectedStat === counter.name}
            value={report[counter.name]}
            previousValue={previousReport[counter.name]}
            label={counter.label}
            details={counter.details}
            color={counter.color}
          />
        ))}
      </div>

      <div className='title'>Livraisons modifié</div>
      <div className='counters'>
        {livraisonsCountersList.map(counter => (
          <Counter
            key={counter.name}
            isSelected={selectedStat === counter.name}
            onClick={() => handleClick(counter.name)}
            value={report[counter.name]}
            previousValue={previousReport[counter.name]}
            label={counter.label}
            details={counter.details}
            color={counter.color}
          />
        ))}
      </div>

      {report.livraisonsCumulNombreDosesPfizer && report.livraisonsCumulNombreDosesModerna && (
        <PieChartPercent
          data={[report.livraisonsCumulNombreDosesPfizer, report.livraisonsCumulNombreDosesModerna]}
          labels={['Livraisons doses Pfizer modifié', 'Livraisons doses Moderna modifié']}
          colors={[colors.darkBlue, colors.darkRed]}
          height={isMobileDevice ? 150 : 130}
        />
      )}

      <style jsx>{`
        .stats {
          background-color: ${colors.lighterGrey};
        }

        .counters {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        }

        .title {
          text-align: center;
          font-size: large;
          font-weight: bold;
          padding: .5em;
          margin-top: .5em;
          border-top: 1px solid ${colors.white};
        }

        .info {
          font-size: small;
          padding: 0 1.5em;
          color: orange;
          text-align: center;
        }
      `}</style>
    </div>
  )
}

VaccinsCounters.defaultProps = {
  report: {},
  previousReport: {}
}

VaccinsCounters.propTypes = {
  report: PropTypes.object,
  previousReport: PropTypes.object
}

export default VaccinsCounters
