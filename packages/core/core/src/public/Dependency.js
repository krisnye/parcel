// @flow
import type {
  Dependency as IDependency,
  Environment as IEnvironment,
  SourceLocation,
  Meta,
  Symbol,
} from '@parcel/types';
import type {Dependency as InternalDependency} from '../types';
import Environment from './Environment';
import Target from './Target';
import nullthrows from 'nullthrows';

const internalDependencyToDependency: WeakMap<
  InternalDependency,
  Dependency,
> = new WeakMap();
const _dependencyToInternalDependency: WeakMap<
  IDependency,
  InternalDependency,
> = new WeakMap();
export function dependencyToInternalDependency(
  dependency: IDependency,
): InternalDependency {
  return nullthrows(_dependencyToInternalDependency.get(dependency));
}

export default class Dependency implements IDependency {
  #dep; // InternalDependency

  constructor(dep: InternalDependency) {
    let existing = internalDependencyToDependency.get(dep);
    if (existing != null) {
      return existing;
    }

    this.#dep = dep;
    _dependencyToInternalDependency.set(this, dep);
    internalDependencyToDependency.set(dep, this);
  }

  get id(): string {
    return this.#dep.id;
  }

  get moduleSpecifier(): string {
    return this.#dep.moduleSpecifier;
  }

  get isAsync(): boolean {
    return !!this.#dep.isAsync;
  }

  get isEntry(): boolean {
    return !!this.#dep.isEntry;
  }

  get isOptional(): boolean {
    return !!this.#dep.isOptional;
  }

  get isURL(): boolean {
    return !!this.#dep.isURL;
  }

  get isWeak(): boolean {
    return !!this.#dep.isWeak;
  }

  get isDeferred(): boolean {
    return this.#dep.isDeferred;
  }

  get loc(): ?SourceLocation {
    return this.#dep.loc;
  }

  get env(): IEnvironment {
    return new Environment(this.#dep.env);
  }

  get meta(): Meta {
    return this.#dep.meta;
  }

  get target(): ?Target {
    let target = this.#dep.target;
    return target ? new Target(target) : null;
  }

  get sourceAssetId(): ?string {
    // TODO: does this need to be public?
    return this.#dep.sourceAssetId;
  }

  get sourcePath(): ?string {
    // TODO: does this need to be public?
    return this.#dep.sourcePath;
  }

  get symbols(): Map<Symbol, Symbol> {
    return this.#dep.symbols;
  }

  get symbolsLocs(): Map<Symbol, SourceLocation> {
    return this.#dep.symbolsLocs;
  }

  get pipeline(): ?string {
    return this.#dep.pipeline;
  }

  setSymbol(exportSymbol: Symbol, symbol: Symbol, loc: ?SourceLocation): void {
    this.#dep.symbols.set(exportSymbol, symbol);
    if (loc) this.#dep.symbolsLocs.set(exportSymbol, loc);
  }
}
