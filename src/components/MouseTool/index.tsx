import React from 'react';
import NavigationControl, { INavigationControlProps } from './navigationControl';
import ScaleControl, { IScaleControlProps } from './scaleControl';
import GeoLocationControl, { IGeoLocationControlProps } from './geoLocationControl';
import OverviewMapControl, { IOverviewMapControlProps } from './overviewMapControl';
import MapTypeMapControl, { IMapTypeControlProps } from './mapTypeControl';
import PanoramaControl, { IPanoramaControlProps } from './panoramaControl';
import DrawingControl, { IDrawingControlProps } from './drawingControl';
import DistanceToolControl, { IDistanceToolControlProps } from './distanceToolControl';

export interface IMouseToolProps {
  children?: React.ReactNode;
}
// @ts-ignore
const MouseTool: React.FunctionComponent<IMouseToolProps> & {
  NavigationControl: React.ForwardRefExoticComponent<INavigationControlProps>;
  ScaleControl: React.ForwardRefExoticComponent<IScaleControlProps>;
  GeoLocationControl: React.ForwardRefExoticComponent<IGeoLocationControlProps>;
  OverviewMapControl: React.ForwardRefExoticComponent<IOverviewMapControlProps>;
  MapTypeMapControl: React.ForwardRefExoticComponent<IMapTypeControlProps>;
  PanoramaControl: React.ForwardRefExoticComponent<IPanoramaControlProps>;
  DrawingControl: React.ForwardRefExoticComponent<IDrawingControlProps>;
  DistanceToolControl: React.ForwardRefExoticComponent<IDistanceToolControlProps>;
} = props => {
  const { children } = props;
  if (children) {
    return React.Children.toArray(children).filter(child => {
      // @ts-ignore
      return /mousetool*?/.test(child.type && child.type.displayName);
    });
  }

  return null;
};
MouseTool.NavigationControl = NavigationControl;
MouseTool.ScaleControl = ScaleControl;
MouseTool.GeoLocationControl = GeoLocationControl;
MouseTool.OverviewMapControl = OverviewMapControl;
MouseTool.MapTypeMapControl = MapTypeMapControl;
MouseTool.PanoramaControl = PanoramaControl;
MouseTool.DrawingControl = DrawingControl;
MouseTool.DistanceToolControl = DistanceToolControl;

export default MouseTool;
